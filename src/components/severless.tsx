// src/components/PaymentVerification.tsx
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js'

// 환경 변수가 없을 경우를 대비한 기본값 설정
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const PORTONE_API_SECRET = process.env.REACT_APP_PORTONE_API_SECRET || '';

// Supabase 클라이언트 초기화
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface VerificationResult {
  success: boolean;
  status?: string;
  message: string;
}

const PaymentVerification: React.FC = () => {
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verifyPayment = async (impUid: string, orderAmount: number, orderId: string) => {
    try {
      // Portone API 호출
      const portoneResponse = await fetch(`https://api.portone.io/payments/${impUid}`, {
        headers: { Authorization: `PortOne ${PORTONE_API_SECRET}` }
      });
      const paymentData = await portoneResponse.json();

      // Supabase에서 주문 정보 조회
      const { data: orderData, error: orderError } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw new Error('주문 정보를 찾을 수 없습니다.');

      // 결제 금액 검증
      if (orderData.amount !== paymentData.amount.total) {
        throw new Error('결제 금액이 일치하지 않습니다.');
      }

      // 결제 상태에 따른 처리
      let status: string;
      switch (paymentData.status) {
        case "VIRTUAL_ACCOUNT_ISSUED":
          status = 'virtual_account_issued';
          break;
        case "PAID":
          status = 'completed';
          break;
        default:
          status = 'failed';
      }

      // Supabase에 결제 상태 업데이트
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ status: status, payment_id: impUid })
        .eq('id', orderId);

      if (updateError) throw new Error('주문 상태 업데이트에 실패했습니다.');

      setResult({ 
        success: true, 
        status: status, 
        message: status === 'completed' ? '결제가 완료되었습니다.' : '가상 계좌가 발급되었습니다.' 
      });

    } catch (error) {
      console.error('Error in verifyPayment:', error);
      const errorMessage = error instanceof Error ? error.message : '결제 검증에 실패했습니다.';
      setResult({ success: false, message: errorMessage });
    }
  };

  return (
    <div>
      <h2>결제 검증</h2>
      <button onClick={() => verifyPayment('test_imp_uid', 10000, 'test_order_id')}>
        결제 검증 테스트
      </button>
      {result && (
        <div>
          <p>결과: {result.success ? '성공' : '실패'}</p>
          {result.status && <p>상태: {result.status}</p>}
          <p>메시지: {result.message}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;