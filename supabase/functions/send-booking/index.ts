import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Google Calendar API functions
async function getGoogleAccessToken() {
  try {
    // Get credentials from environment variable (as JSON string)
    const credentialsJson = Deno.env.get('GOOGLE_CREDENTIALS_JSON')!
    const credentials = JSON.parse(credentialsJson)
    
    const now = Math.floor(Date.now() / 1000)
    const expiry = now + 3600 // 1 hour
    
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    }
    
    const payload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/calendar',
      aud: 'https://oauth2.googleapis.com/token',
      exp: expiry,
      iat: now
    }
    
    // Convert to base64url
    const textEncoder = new TextEncoder()
    const headerBase64 = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    const payloadBase64 = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    
    const message = `${headerBase64}.${payloadBase64}`
    
    // Clean and format the private key properly
    const privateKey = credentials.private_key
      .replace(/\\n/g, '\n')
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s+/g, '')
    
    // Decode the base64 private key
    const keyData = Uint8Array.from(atob(privateKey), c => c.charCodeAt(0))
    
    const key = await crypto.subtle.importKey(
      'pkcs8',
      keyData,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
      },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      key,
      textEncoder.encode(message)
    )
    
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    
    const jwt = `${message}.${signatureBase64}`
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    })
    
    const tokenData = await tokenResponse.json()
    
    if (!tokenData.access_token) {
      console.error('Token response:', tokenData)
      throw new Error(`Failed to get access token: ${tokenData.error || 'Unknown error'}`)
    }
    
    return tokenData.access_token
  } catch (error) {
    console.error('Error in getGoogleAccessToken:', error)
    throw error
  }
}

async function createGoogleCalendarEvent(clientName: string, service: string, date: string, time: string, clientPhone: string) {
  const accessToken = await getGoogleAccessToken()
  const calendarId = Deno.env.get('GOOGLE_CALENDAR_ID')!
  
  // Convert date and time to ISO format
  const [day, month, year] = date.split('.')
  const startDateTime = new Date(`${year}-${month}-${day}T${time}:00`)
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1 hour duration
  
  // Format description with client details
  const descriptionLines = [
    `Запись для клиента: ${clientName}`,
    `Услуга: ${service}`
  ]
  if (clientPhone) {
    descriptionLines.push(`Телефон: ${clientPhone}`)
  }
  
  const event = {
    summary: `${service} - ${clientName}`,
    description: descriptionLines.join('\n'),
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Europe/Moscow'
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Europe/Moscow'
    },
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: 1440 }] // 24 hours before
    }
  }
  
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
  
  if (!response.ok) {
    const errorData = await response.text()
    console.error('Google Calendar API error:', errorData)
    throw new Error('Failed to create calendar event')
  }
  
  const eventData = await response.json()
  console.log(`Google Calendar event created: ${eventData.htmlLink}`)
  return eventData.id
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, phone, serviceType, categoryId, serviceId, date, time } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if time slot is already booked in database
    const appointmentDateTime = `${date.split('.').reverse().join('-')} ${time}:00`
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_time', appointmentDateTime)
      .single()

    if (existingAppointment) {
      throw new Error('Это время уже занято')
    }

    let serviceInfo = serviceType;
    
    // If it's not a consultation, get service details
    if (serviceType !== 'Консультация по телефону' && serviceId) {
      const { data: service } = await supabase
        .from('services')
        .select('title, price')
        .eq('id', serviceId)
        .single()
      
      if (service) {
        serviceInfo = `${service.title} (${service.price})`
      }
    }

    // Prepare message for Telegram
    const message = `🔔 Новая заявка на запись!

👤 Имя: ${name}
📞 Телефон: ${phone}
💊 Услуга: ${serviceInfo}
📅 Дата: ${date}
⏰ Время: ${time}

#новая_заявка`

    // Send to Telegram
    const BOT_TOKEN = Deno.env.get('BOT_TOKEN')
    const ADMIN_ID = Deno.env.get('ADMIN_ID')

    if (!BOT_TOKEN || !ADMIN_ID) {
      throw new Error('Telegram credentials not configured')
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: ADMIN_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.text()
      console.error('Telegram API error:', errorData)
      throw new Error('Failed to send message to Telegram')
    }

    // Create Google Calendar event
    let googleEventId = null;
    try {
      googleEventId = await createGoogleCalendarEvent(name, serviceInfo, date, time, phone);
      console.log('Google Calendar event created:', googleEventId);
    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
      // Continue with database save even if calendar fails
    }

    // Save appointment to database
    const { error: insertError } = await supabase
      .from('appointments')
      .insert({
        client_name: name,
        client_phone: phone,
        service_id: serviceId || null,
        appointment_time: appointmentDateTime,
        status: 'pending',
        google_event_id: googleEventId
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw new Error('Ошибка при сохранении записи')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Booking sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})