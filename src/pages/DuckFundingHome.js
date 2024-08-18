import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const DuckFundingHome = () => {
    
 
  



  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slides = [
    { image: "https://catseye-ent.com/web/product/medium/202310/2c34975cd0a5281de76bd245bfcd9560.jpg", title: "사고력부터 집문능력까지", subtitle: "하루 10분만 투자하세요" },
    { image: "https://health.chosun.com/site/data/img_dir/2023/06/23/2023062301899_0.jpg", title: "신선집중 스페셜 기획전", subtitle: "핫 이슈 프로젝트를 만나보세요!" },
    { image: "/api/placeholder/1200/400", title: "단 일주일 동안만 열리는", subtitle: "한여름의 캠핑" },
  ];

  const categories = [
    "전체", "BEST 펀딩", "테크·가전", "패션", "뷰티", "홈·리빙", "스포츠·모빌리티", "푸드", "도서·컨텐츠", "클래스", "디자인", "반려동물", "아트", "캐릭터·굿즈", "여행·음악", "기타"
  ];

  const products = [
    { image: "https://catseye-ent.com/web/product/medium/202310/2c34975cd0a5281de76bd245bfcd9560.jpg", title: "5-13세 취부모님! 망설이면 놓여요. '이거' 하나로 끝나는 유튜 교육", percentage: "10,439%", remaining: "8일 남음", backers: "5,219명" },
    { image: "https://health.chosun.com/site/data/img_dir/2023/06/23/2023062301899_0.jpg", title: "피부 멜로틴 몰려 주름, 모공의 근본을 개선하는 비건 PDRN 앰플", percentage: "4,973%", remaining: "5일 남음", backers: "2,486명" },
    // ... 나머지 6개의 제품 정보를 여기에 추가 ...
  ];


  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  // 자동 슬라이드 전환을 위한 useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 3000); // 3초마다 자동 슬라이드

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [isTransitioning, slides.length]);

  // 전환이 완료된 후 상태를 업데이트하기 위한 useEffect
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500); // 전환 시간 (0.5초)
      return () => clearTimeout(timer); // 타이머 정리
    }
  }, [currentSlide]);

  return (
    <div className="duckfunding-home">
     

      <main>
        <div className="banner-slider">
          <button className="slider-button prev" onClick={prevSlide}><ChevronLeft size={24} /></button>
          <div className="slide" style={{backgroundImage: `url(${slides[currentSlide].image})`}}>
            <div className="slide-content">
              <h2>{slides[currentSlide].title}</h2>
              <p>{slides[currentSlide].subtitle}</p>
            </div>
          </div>
          <button className="slider-button next" onClick={nextSlide}><ChevronRight size={24} /></button>
        </div>

        <div className="categories">
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <div className="category-icon"></div>
              <span>{category}</span>
            </div>
          ))}
        </div>












        
        <div className="product-grid">
          {products.map((product, index) => (
            <div key={index} className="product-item">
              <div className="product-image" style={{backgroundImage: `url(${product.image})`}}>
                <button className="like-button"><Heart size={20} /></button>
              </div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <div className="product-stats">
                  <span className="percentage">{product.percentage} 달성</span>
                  <span className="remaining">{product.remaining}</span>
                </div>
                <div className="backers">{product.backers}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .duckfunding-home {
          font-family: 'Noto Sans KR', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
        }


        .banner-slider {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .slide {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          padding: 0 50px;
        }

        .slide-content {
          color: white;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
        }

        .slider-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.5);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .prev { left: 10px; }
        .next { right: 10px; }

        .categories {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          overflow-x: auto;
        }

        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 10px;
        }

        .category-icon {
          width: 40px;
          height: 40px;
          background-color: #f0f0f0;
          border-radius: 50%;
          margin-bottom: 5px;
        }


        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .product-item {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }

        .product-image {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .like-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: white;
          border: none;
          border-radius: 50%;
          padding: 5px;
          cursor: pointer;
        }

        .product-info {
          padding: 15px;
        }

        .product-info h3 {
          margin: 0 0 10px;
          font-size: 16px;
          line-height: 1.4;
        }

        .product-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .percentage {
          color: #00c4c4;
          font-weight: bold;
        }

        .remaining {
          color: #666;
        }

        .backers {
          color: #666;
          font-size: 14px;
        }

      `}</style>
    </div>
  );
};

export default DuckFundingHome;