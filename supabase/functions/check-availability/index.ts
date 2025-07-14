import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Google Calendar API functions
async function getGoogleAccessToken() {
  const serviceAccountEmail = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL')!
  const privateKeyRaw = Deno.env.get('GOOGLE_PRIVATE_KEY')!
  
  // Clean and format the private key properly
  const privateKey = privateKeyRaw
    .replace(/\\n/g, '\n')
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '')
  
  const now = Math.floor(Date.now() / 1000)
  const expiry = now + 3600 // 1 hour
  
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }
  
  const payload = {
    iss: serviceAccountEmail,
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
  
  try {
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

    // Get calendar events for the specified date
    const events = await getCalendarEvents(date)
    
    // Extract busy time slots
    const busySlots = events.map((event: any) => {
      if (event.start && event.start.dateTime) {
        const startTime = new Date(event.start.dateTime)
        const hours = startTime.getHours().toString().padStart(2, '0')
        const minutes = startTime.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
      }
      return null
    }).filter(Boolean)

    return new Response(
      JSON.stringify({ 
        success: true, 
        busySlots,
        totalEvents: events.length 
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