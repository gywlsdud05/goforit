import React, { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';

const ProductPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/path/to/image1.jpg',
    '/path/to/image2.jpg',
    'http://via.placeholder.com/300x200',
    // ... more images
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Slider */}
        <div className="md:w-1/2 relative">
          <img src={images[currentImage]} alt="Product" className="w-full rounded-lg" />
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {currentImage + 1}/{images.length}
          </div>
          <button onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">&lt;</button>
          <button onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">&gt;</button>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <div className="bg-blue-100 text-blue-800 inline-block px-2 py-1 rounded mb-2">애니메이션  굿즈</div>
          <h1 className="text-2xl font-bold mb-4">[명탐정코난] 연재 '30주년' 축하 기념 TV판 공식 스페셜 굿즈!</h1>
          <p className="text-gray-600 mb-4">명탐정코난 연재 30주년 스페셜 패키지에 여러분을 초대합니다! 소장가치 넘치는 굿즈를 행성 굿즈 지구 숍 만나보세요. 베스트 아트워크로 구성된 스티커팩, 그리고 스페셜 키링까지!</p>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">4,529<span className="text-sm text-gray-500">% 달성</span></div>
            <div className="text-2xl font-semibold">22,647,700<span className="text-sm text-gray-500">원 달성</span></div>
            <div className="text-sm text-gray-500">535명 참여</div>
          </div>

          <button className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold mb-4">펀딩하기</button>

          <div className="flex justify-between">
            <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
              <Heart size={20} /> 2,855
            </button>
            <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
              <Share2 size={20} /> 공유
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;