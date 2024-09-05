import styles from "./useSlide.module.css";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Star,
  Tv,
  Shirt,
  Droplet,
  Sofa,
  Tent,
  Apple,
  Book,
  Play,
  Palette,
  Dog,
  PaintBucket,
  Smile,
  Plane,
  Baby,
  Music,
  Gamepad2,
  MessageCircleMore,
  Car,
  IdCard,
  ChartNetwork,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

const SlideComponent = () => {
  const slides = [
    {
      image:
        "https://catseye-ent.com/web/product/medium/202310/2c34975cd0a5281de76bd245bfcd9560.jpg",
      title: "사고력부터 집중능력까지",
      subtitle: "하루 10분만 투자하세요",
    },
    {
      image:
        "https://health.chosun.com/site/data/img_dir/2023/06/23/2023062301899_0.jpg",
      title: "신선집중 스페셜 기획전",
      subtitle: "핫 이슈 프로젝트를 만나보세요!",
    },
    {
      image: "/api/placeholder/1200/400",
      title: "단 일주일 동안만 열리는",
      subtitle: "한여름의 캠핑",
    },
  ];

  const categories = [
    { name: "전체", icon: Home },
    { name: "BEST 펀딩", icon: Star },
    { name: "테크·가전", icon: Tv },
    { name: "패션", icon: Shirt },
    { name: "뷰티", icon: Droplet },
    { name: "홈·리빙", icon: Sofa },
    { name: "스포츠·모빌리티", icon: Tent },
    { name: "푸드", icon: Apple },
    { name: "도서·컨텐츠", icon: Book },
    { name: "클래스", icon: Play },
    { name: "디자인", icon: Palette },
    { name: "반려동물", icon: Dog },
    { name: "아트", icon: PaintBucket },
    { name: "캐릭터·굿즈", icon: Smile },
    { name: "영화·음악", icon: Music },
    { name: "키즈", icon: Baby },
    { name: "게임", icon: Gamepad2 },
    { name: "만화·웹툰", icon: MessageCircleMore },
    { name: "여행", icon: Plane },
    { name: "자동차", icon: Car },
    { name: "membership", icon: IdCard },
    { name: "소셜", icon: ChartNetwork },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const interval = 3000;

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [isTransitioning, slides.length]);

  const prevSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [isTransitioning, slides.length]);

  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, interval);

    return () => clearInterval(autoSlideInterval);
  }, [nextSlide, isTransitioning, interval]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isTransitioning]);

  return (
    <div>
      <div className={styles.bannerSlider}>
        <button
          className={`${styles.sliderButton} ${styles.prev}`}
          onClick={prevSlide}
        >
          <ChevronLeft size={24} />
        </button>
        <div
          className={styles.slide}
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        >
          <div className={styles.slideContent}>
            <h2>{slides[currentSlide].title}</h2>
            <p>{slides[currentSlide].subtitle}</p>
          </div>
        </div>
        <button
          className={`${styles.sliderButton} ${styles.next}`}
          onClick={nextSlide}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className={styles.categories}>
        {categories.map((category, index) => (
          <div key={index} className={styles.categoryItem}>
            <category.icon className={styles.categoryIcon} size={24} />
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideComponent;
