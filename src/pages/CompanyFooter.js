import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';

const CompanyFooter = () => {
  return (
    <footer className="bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-bold text-lg mb-4">와디즈 고객센터</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p>와디즈(주)</p>
            <p>대표이사 신혜성 | 사업자등록번호 258-87-01370</p>
            <p>통신판매업신고번호 2021-성남분당C-1153</p>
            <p>경기 성남시 분당구 판교로 242 PDC A동 402호</p>
          </div>
          <div>
            <p>이메일 상담 info@wadiz.kr</p>
            <p>유선 상담 1661-9056</p>
            <p>© wadiz Co., Ltd.</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-6">
          <button className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center">
            채팅 상담하기 <ChevronRight size={20} />
          </button>
          <button className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center">
            문의 등록하기 <ChevronRight size={20} />
          </button>
          <button className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center">
            도움말 센터 바로가기 <ChevronRight size={20} />
          </button>
          <button className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center">
            Contact for Global <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">상담 가능 시간</h3>
          <p>평일 오전 9시 ~ 오후 6시 (주말, 공휴일 제외)</p>
        </div>
        
        <div className="text-sm text-gray-600">
          <p className="mb-2">일부 상품의 경우 와디즈는 통신판매중개자이며 통신판매 당사자가 아닙니다.</p>
          <p className="mb-2">해당되는 상품의 경우 상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있으므로, 각 상품 페이지에서 구체적인 내용을 확인하시기 바랍니다.</p>
          <p>와디즈 사이트의 콘텐츠 정보, 상품의 거래 정보, 보상 정보, 유저 리뷰, 타인의 권리 침해 관한 정보로 인한 문제와 관련된 모든 책임과 정보통신망법, 전자상거래법, 소비자보호법, 저작권법 침해등에 관한 문제는 관련 법에 따라 책임을 집니다.</p>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button className="flex items-center bg-black text-white rounded-md px-4 py-2">
            <span className="mr-2">Android앱</span>
          </button>
          <button className="flex items-center bg-black text-white rounded-md px-4 py-2">
            <span className="mr-2">iOS앱</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default CompanyFooter;