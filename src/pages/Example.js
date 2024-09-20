import SlideComponent from "./ImageSlider";
import { Editor } from "@tinymce/tinymce-react";
import { Star } from "lucide-react";
import { useRef, useState } from "react";
import React, { useEffect } from "react";
import {
  EffectCoverflow,
  EffectCards,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./FoodSlider.module.css";

const slides = [
  {
    image:
      "data:image/jpeg;base64,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",
    title: "도톰하고 자연스런 입술 확장",
    subtitle: "입술 라인을 따라 채워 펌핑만 안되세요",
  },
  {
    image: "/api/placeholder/300/400",
    title: "60년 전통 캐리어 명가",
    subtitle: "밀고 구매하는 국내브랜드 여행캐리어",
  },
  {
    image: "/api/placeholder/300/400",
    title: "물감보다 더 리얼한 아이패드 수채화",
    subtitle: "아이패드 미술, 쉽게 시작하세요",
  },
];

const Example = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.start();
    }
  }, []);
  ///
  const editorRef = useRef(null);

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
  };

  const handleSubmit = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  const [text, setText] = useState("");
  const maxLength2 = 40;

  const handleChange2 = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxLength) {
      setText(inputText);
    }
  };

  const remainingChars = maxLength2 - text.length;

  const [title, setTitle] = useState("");
  const maxLength = 40;
  const handleChange = (event) => {
    const { value } = event.target;
    console.log("Input value:", value);
    if (value.length <= maxLength) {
      setTitle(value);
      console.log("Updated title:", value);
    }
  };
  const buttonStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#e99999",
  };

  return (
    <div>
      <div>
        <SlideComponent />
      </div>
      <div>
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAADAFBMVEXw8PDYJiYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8btk+AAABAHRSTlP//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKmfXxgAAEEtJREFUeNoBQBC/7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQAAAAAAAAAAAAABAQEBAQEBAQEBAAAAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwsIINWjDb4IAAAAASUVORK5CYII="
          alt="Base64 Image"
        />
      </div>
      <div className="mb-4">
        <div>
          <button style={buttonStyle}>로그아웃</button>
        </div>
        <label htmlFor="title" className="block mb-2">
          제목
        </label>
        <input
          type="text"
          id="title"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="상품 제목을 입력하세요"
          value={title}
          value2={text}
          onChange={handleChange}
          onChange2={handleChange}
        />
        <div className="mt-2 text-sm">
          <span>{maxLength - title.length}자 남음</span>
          <span>Characters remaining: {remainingChars}</span>
        </div>
      </div>
      <input
        type="text"
        id="title"
        className="w-full border border-gray-300 rounded-md p-2"
        placeholder="상품 제목을 입력하세요"
        value={text}
        onChange={handleChange2}
      />
      <section id={styles.tranding}>
        <div className={styles.container}>
          <h3 className={`${styles.textCenter} ${styles.sectionSubheading}`}>
            - popular Delivery -
          </h3>
          <h1 className={`${styles.textCenter} ${styles.sectionHeading}`}>
            Tranding food
          </h1>
        </div>
        <div className={styles.container}>
          <Swiper
            onSwiper={(swiperInstance) => {
              swiperRef.current = swiperInstance;
            }}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            //slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            autoplay={{ delay: 2500 }}
            modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
            className={styles.trandingSlider}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index} className={styles.trandingSlide}>
                <div className={styles.trandingSlideImg}>
                  <img src={slide.image} alt={slide.title} />
                </div>
                <div className={styles.trandingSlideContent}>
                  <h1 className={styles.foodPrice}>{slide.price}</h1>
                  <div className={styles.trandingSlideContentBottom}>
                    <h2 className={styles.foodName}>{slide.title}</h2>
                    <h3 className={styles.foodRating}>
                      <span>{slide.rating}</span>
                      <div className={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#ec994b"
                            color="#ec994b"
                          />
                        ))}
                      </div>
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div className={styles.trandingSliderControl}>
              <div className={`swiper-button-prev ${styles.sliderArrow}`}>
                <ion-icon name="arrow-back-outline"></ion-icon>
              </div>
              <div className={`swiper-button-next ${styles.sliderArrow}`}>
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </Swiper>
        </div>
      </section>

      <section id={styles.tranding}>
        <div className={styles.container}>
          <h3 className={`${styles.textCenter} ${styles.sectionSubheading}`}>
            - popular Delivery -
          </h3>
          <h1 className={`${styles.textCenter} ${styles.sectionHeading}`}>
            Trending food
          </h1>
        </div>
        <div className={styles.container}>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={3}
            spaceBetween={30}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className={styles.trandingSlider}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index} className={styles.trandingSlide}>
                <div className={styles.trandingSlideImg}>
                  <img src={slide.image} alt={slide.title} />
                </div>
                <div className={styles.trandingSlideContent}>
                  <h1 className={styles.foodPrice}>{slide.price}</h1>
                  <div className={styles.trandingSlideContentBottom}>
                    <h2 className={styles.foodName}>{slide.title}</h2>
                    <h3 className={styles.foodRating}>
                      <span>{slide.rating}</span>
                      <div className={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#ec994b"
                            color="#ec994b"
                          />
                        ))}
                      </div>
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div className={styles.trandingSliderControl}>
              <div className={`swiper-button-prev ${styles.sliderArrow}`}>
                <ion-icon name="arrow-back-outline"></ion-icon>
              </div>
              <div className={`swiper-button-next ${styles.sliderArrow}`}>
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </Swiper>
        </div>
      </section>

      <section id={styles.tranding}>
        <div className={styles.container}>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={3}
            spaceBetween={100} // 간격을 100px로 증가
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className={styles.trandingSlider}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index} className={styles.trandingSlide}>
                <div className={styles.trandingSlideImg}>
                  <img src={slide.image} alt={slide.title} />
                </div>
                <div className={styles.trandingSlideContent}>
                  <h2 className={styles.slideTitle}>{slide.title}</h2>
                  <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                </div>
              </SwiperSlide>
            ))}

            <div className={styles.trandingSliderControl}>
              <div className={`swiper-button-prev ${styles.sliderArrow}`}></div>
              <div className={`swiper-button-next ${styles.sliderArrow}`}></div>
              <div className="swiper-pagination"></div>
            </div>
          </Swiper>
        </div>
      </section>

      <section id={styles.tranding}>
        <div className={styles.container}>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.5}
            spaceBetween={30}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
              renderBullet: function (index, className) {
                return (
                  '<span class="' +
                  className +
                  '"><span class="bullet-inner"></span></span>'
                );
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className={styles.trandingSlider}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index} className={styles.trandingSlide}>
                <div className={styles.trandingSlideImg}>
                  <img src={slide.image} alt={slide.title} />
                </div>
                <div className={styles.trandingSlideContent}>
                  <h2 className={styles.slideTitle}>{slide.title}</h2>
                  <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                </div>
              </SwiperSlide>
            ))}

            <div className={styles.trandingSliderControl}>
              <div className={`swiper-button-prev ${styles.sliderArrow}`}></div>
              <div className={`swiper-button-next ${styles.sliderArrow}`}></div>
              <div className="swiper-pagination"></div>
            </div>
          </Swiper>
        </div>
      </section>

      <section id={styles.tranding}>
        <div className={styles.container}>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.5}
            spaceBetween={20}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
              renderBullet: function (index, className) {
                return (
                  '<span class="' +
                  className +
                  '"><span class="bullet-inner"></span></span>'
                );
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className={styles.trandingSlider}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index} className={styles.trandingSlide}>
                <div className={styles.trandingSlideImg}>
                  <img src={slide.image} alt={slide.title} />
                </div>
                <div className={styles.trandingSlideContent}>
                  <h2 className={styles.slideTitle}>{slide.title}</h2>
                  <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                </div>
              </SwiperSlide>
            ))}

            <div className={styles.trandingSliderControl}>
              <div className={`swiper-button-prev ${styles.sliderArrow}`}></div>
              <div className={`swiper-button-next ${styles.sliderArrow}`}></div>
              <div className="swiper-pagination"></div>
            </div>
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Example;
