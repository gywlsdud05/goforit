// verifyPayment.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyPayment(impUid, orderAmount, orderId) {
  try {
    const { data, error } = await supabase.functions.invoke('verifyPayment', {
      body: JSON.stringify({ impUid, orderAmount, orderId }),
    })

    if (error) throw error

    return data
  } catch (error) {
    console.error('결제 검증 중 오류 발생:', error)
    return { 
      success: false, 
      message: error.message || '결제 검증에 실패했습니다.' 
    }
  }
}

export default verifyPayment