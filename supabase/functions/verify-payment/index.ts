import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log("Function invoked with request:", req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderAmount, payment_id } = await req.json()
    console.log("Received data:", { orderAmount, payment_id });

    if (!orderAmount || !payment_id) {
      throw new Error('Missing required parameters: orderAmount or payment_id');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const portoneApiSecret = Deno.env.get('PORTONE_API_SECRET');

    if (!supabaseUrl || !supabaseKey || !portoneApiSecret) {
      throw new Error('Missing environment variables');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    })

    console.log("Calling Portone API...");
    const portoneResponse = await fetch(`https://api.portone.io/payments/${payment_id}`, {
      headers: { Authorization: `PortOne ${portoneApiSecret}` }
    })

    console.log("Portone API response status:", portoneResponse.status);
    
    if (!portoneResponse.ok) {
      throw new Error(`Portone API error: ${portoneResponse.status} ${portoneResponse.statusText}`);
    }
    
    const paymentData = await portoneResponse.json()
    console.log("Portone API response:", paymentData);

    console.log("Fetching order data from Supabase...");
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orderPayment')
      .select('*')
      .eq('payment_id', payment_id)
      .single()

    if (orderError) {
      console.error("Error fetching order data:", orderError);
      throw new Error('주문 정보를 찾을 수 없습니다.');
    }
    console.log("Order data:", orderData);

    if (orderData.amountOfproduct !== paymentData.amount.total) {
      throw new Error(`결제 금액이 일치하지 않습니다. 주문금액: ${orderData.amountOfproduct}, 결제금액: ${paymentData.amount.total}`);
    }

    let status: string
    switch (paymentData.status) {
      case "VIRTUAL_ACCOUNT_ISSUED":
        status = 'virtual_account_issued'
        break
      case "PAID":
        status = 'completed'
        break
      default:
        status = 'failed'
    }

    console.log("Updating order status in Supabase...");
    const { error: updateError } = await supabaseClient
      .from('orderPayment')
      .update({ payment_status: status })
      .eq('payment_id', payment_id)

    if (updateError) {
      console.error("Error updating order status:", updateError);
      throw new Error('주문 상태 업데이트에 실패했습니다.');
    }

    const responseData = { verified: true, status: status }
    console.log("Sending response:", responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error in verify-payment function:', error);
    return new Response(JSON.stringify({ 
      error: error.message, 
      stack: error.stack,
      details: "서버에서 오류가 발생했습니다. 관리자에게 문의해주세요."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})