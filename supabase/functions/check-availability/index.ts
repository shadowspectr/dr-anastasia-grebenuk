import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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

async function getCalendarEvents(date: string) {
  const accessToken = await getGoogleAccessToken()
  const calendarId = Deno.env.get('GOOGLE_CALENDAR_ID')!
  
  // Convert date to ISO format for API call
  const [day, month, year] = date.split('.')
  const startOfDay = new Date(`${year}-${month}-${day}T00:00:00`)
  const endOfDay = new Date(`${year}-${month}-${day}T23:59:59`)
  
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true&orderBy=startTime`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  if (!response.ok) {
    const errorData = await response.text()
    console.error('Google Calendar API error:', errorData)
    throw new Error('Failed to fetch calendar events')
  }
  
  const eventsData = await response.json()
  return eventsData.items || []
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { date } = await req.json()

    if (!date) {
      throw new Error('Date is required')
    }

    // Initialize Supabase client to check database appointments
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get calendar events for the specified date
    const events = await getCalendarEvents(date)
    
    // Build busy time slots from Google Calendar with hour-level granularity
    const [dStr, mStr, yStr] = date.split('.')
    const y = parseInt(yStr, 10)
    const m = parseInt(mStr, 10) - 1
    const d = parseInt(dStr, 10)

    const timeSlots = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
      "15:00", "16:00", "17:00", "18:00"
    ]

    // Helper to create UTC date for the specific slot on the selected day
    const slotToUtcRange = (slot: string) => {
      const [hh] = slot.split(':').map((n) => parseInt(n, 10))
      const start = new Date(Date.UTC(y, m, d, hh, 0, 0))
      const end = new Date(Date.UTC(y, m, d, hh + 1, 0, 0))
      return { start, end }
    }

    // Normalize calendar events into start/end Date objects
    const normalizedEvents = events.map((event: any) => {
      if (event.start?.dateTime && event.end?.dateTime) {
        return {
          allDay: false,
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime)
        }
      }
      // All-day event blocks the whole day
      if (event.start?.date && event.end?.date) {
        return { allDay: true, start: null, end: null }
      }
      return null
    }).filter(Boolean) as Array<{ allDay: boolean; start: Date | null; end: Date | null }>

    let calendarBusySlots: string[] = []

    if (normalizedEvents.some(e => e.allDay)) {
      // Any all-day event => mark every slot busy
      calendarBusySlots = [...timeSlots]
    } else {
      // For each slot, if it overlaps any event, mark busy
      calendarBusySlots = timeSlots.filter(slot => {
        const { start: slotStart, end: slotEnd } = slotToUtcRange(slot)
        return normalizedEvents.some(e => {
          if (!e.start || !e.end) return false
          return e.start < slotEnd && e.end > slotStart
        })
      })
    }

    console.log('[check-availability] date:', date, 'events:', events.length, 'calendarBusySlots:', calendarBusySlots)

    // Check if the date falls within any vacation period
    const [day, month, year] = date.split('.')
    const dateForDb = `${year}-${month}-${day}`
    
    const { data: vacationPeriods, error: vacationError } = await supabase
      .from('vacation_periods')
      .select('start_date, end_date')
      .lte('start_date', dateForDb)
      .gte('end_date', dateForDb)
      
    if (vacationError) {
      console.error('Vacation periods query error:', vacationError)
    }
    
    // If there's a vacation period for this date, return all time slots as busy
    if (vacationPeriods && vacationPeriods.length > 0) {
      const allTimeSlots = [
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00", "18:00"
      ]
      
      return new Response(
        JSON.stringify({ 
          success: true,
          busySlots: allTimeSlots,
          calendarEvents: events.length,
          dbAppointments: 0,
          vacationBlocked: true,
          message: "День заблокирован: отпуск"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
    
    // Check database for appointments on this date
    const { data: dbAppointments, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .gte('appointment_time', `${dateForDb} 00:00:00`)
      .lt('appointment_time', `${dateForDb} 23:59:59`)

    if (error) {
      console.error('Database error:', error)
    }

    // Extract busy time slots from database
    const dbBusySlots = (dbAppointments || []).map((appointment: any) => {
      const appointmentTime = new Date(appointment.appointment_time)
      const hours = appointmentTime.getHours().toString().padStart(2, '0')
      // Round to the hour to align with available time slots
      return `${hours}:00`
    })

    // Combine both sources and remove duplicates
    const allBusySlots = [...new Set([...calendarBusySlots, ...dbBusySlots])]

    return new Response(
      JSON.stringify({ 
        success: true, 
        busySlots: allBusySlots,
        calendarEvents: events.length,
        dbAppointments: (dbAppointments || []).length
      }),
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