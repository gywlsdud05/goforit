import React from 'react';

const ProductWriteFooter = ({ onTemporarySave, onSubmit, isValid }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end">
      <button
        onClick={onTemporarySave}
        className="mr-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        임시저장
      </button>
      <button
        onClick={onSubmit}
        disabled={!isValid}
        className={`px-4 py-2 rounded ${
          isValid
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        등록하기
      </button>
    </div>
  );
};

export default ProductWriteFooter;