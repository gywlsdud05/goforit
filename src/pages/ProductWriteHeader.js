import React from "react";
import { Link } from "react-router-dom";

const ProductWriteHeader = ({ id }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
            DuckFunding
          </Link>
          <span className="ml-4 text-sm text-gray-500">메이커스튜디오</span>
          <span className="ml-2 text-sm text-gray-500">펀딩·프리오더</span>
          <span className="ml-2 text-sm text-teal-500">작성 중</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">프로젝트 번호 {id}</span>
          <button className="text-sm text-gray-500">미리보기</button>
          <button className="text-sm text-gray-500">나가기</button>
        </div>
      </div>
    </header>
  );
};

export default ProductWriteHeader;
