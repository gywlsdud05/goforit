import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Navigation, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./ImageSlider.module.css";

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
  {
    image: "/api/placeholder/1200/400",
    title: "단 일주일 동안만 열리는",
    subtitle: "한여름의 캠핑2",
  },
  {
    image: "/api/placeholder/1200/400",
    title: "단 일주일 동안만 열리는",
    subtitle: "한여름의 캠핑3",
  },
];

const ImageSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    if (swiper) {
      const timer = setInterval(() => {
        const newProgress = ((activeIndex + 1) / swiper.slides.length) * 100;
        setProgress(newProgress);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [swiper, activeIndex]);

  return (
    <div className={styles.container}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={25}
        slidesPerView={1.5}
        centeredSlides={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className={styles.sliderContainer}
        onSwiper={setSwiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div className={styles.slideContent}>
              <img
                src={slide.image}
                alt={slide.title}
                className={styles.slideImage}
              />
              <div className={styles.slideText}>
                <h2 className={styles.slideTitle}>{slide.title}</h2>
                <p className={styles.slideSubtitle}>{slide.subtitle}</p>
              </div>
              <div className={styles.slideOverlay}></div>
            </div>
          </SwiperSlide>
        ))}
        <div
          className={`${styles.navigationButton} ${styles.prevButton} swiper-button-prev`}
        >
          <ChevronLeft size={24} />
        </div>
        <div
          className={`${styles.navigationButton} ${styles.nextButton} swiper-button-next`}
        >
          <ChevronRight size={24} />
        </div>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </Swiper>
    </div>
  );
};

export default ImageSlider;
