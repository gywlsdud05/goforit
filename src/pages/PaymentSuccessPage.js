import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const { orderDetails } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">결제 완료</h2>
            <p className="mt-2 text-sm text-gray-600">
              주문이 성공적으로 완료되었습니다. 감사합니다!
            </p>
          </div>

          {orderDetails && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">주문 상세</h3>
              <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                <div className="py-3 flex justify-between text-sm font-medium">
                  <dt className="text-gray-500">주문 번호</dt>
                  <dd className="text-gray-900">{orderDetails.orderId}</dd>
                </div>
                <div className="py-3 flex justify-between text-sm font-medium">
                  <dt className="text-gray-500">상품명</dt>
                  <dd className="text-gray-900">{orderDetails.productName}</dd>
                </div>
                <div className="py-3 flex justify-between text-sm font-medium">
                  <dt className="text-gray-500">결제 금액</dt>
                  <dd className="text-gray-900">{orderDetails.amount.toLocaleString()}원</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">안내 사항</h3>
            <p className="mt-2 text-sm text-gray-600">
              주문하신 상품은 2-3일 내에 발송될 예정입니다. 배송 관련 문의사항은 고객센터로 연락 주시기 바랍니다.
            </p>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;