import React from 'react';
import { useForm, Controller } from 'react-hook-form';

const RewardDesign = ({ control, register, errors }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">리워드 설계</h2>

      <div className="mb-4">
        <label htmlFor="price" className="block mb-2">
          가격 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            id="price"
            className="w-full border border-gray-300 rounded-md p-2 pr-8"
            placeholder="리워드 가격을 입력하세요"
            {...register('price', {
              required: '가격은 필수입니다.',
              min: { value: 1000, message: '최소 1,000원 이상이어야 합니다.' },
              max: { value: 1000000, message: '최대 1,000,000원 이하여야 합니다.' },
              valueAsNumber: true
            })}
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">원</span>
        </div>
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        <p className="text-sm text-gray-500 mt-1">1,000원 ~ 1,000,000원 사이에서 설정해 주세요.</p>
      </div>

      {/* 여기에 추가적인 리워드 관련 필드들을 넣을 수 있습니다. 
         예: 리워드 제목, 설명, 옵션 등 */}
    </div>
  );
};

export default RewardDesign;