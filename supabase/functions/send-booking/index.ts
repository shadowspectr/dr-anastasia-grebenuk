import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Save appointment to database
    await supabase
      .from('appointments')
      .insert({
        client_name: name,
        client_phone: phone,
        service_id: serviceId || null,
        appointment_time: `${date} ${time}:00`,
        status: 'pending'
      })

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