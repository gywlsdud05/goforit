import useProductWriteStore from "../../store/useProductWriteStore";
import React from "react";
import "react-image-crop/dist/ReactCrop.css";
import IntroMediaUpload from "./IntroMediaUpload";
import MainImageUpload from "./MainImageUpload";
import ProductStory from "./ProductStory";
import styles from "./StoryWriting.module.css";

const StoryWriting = ({ control, register, errors, watch }) => {
  const { formData, addTag, removeTag, setFormData } = useProductWriteStore();

  const maxLength = 40;
  const titleValue = watch("title") || "";

  const handleMainImageUpload = (croppedImageUrl) => {
    setFormData({ mainImage: croppedImageUrl });
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      addTag(e.target.value.trim());
      e.target.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label htmlFor="title" className={styles.label}>
          제목
        </label>
        <input
          type="text"
          id="title"
          className={styles.input}
          placeholder="상품 제목을 입력하세요"
          {...register("title", {
            required: "Title is required",
            maxLength: {
              value: maxLength,
              message: `Title should be at most ${maxLength} characters`,
            },
          })}
        />
        <span className={styles.characterCount}>
          {maxLength - titleValue.length}자 남음
        </span>
        {errors.title && (
          <p className={styles.errorText}>{errors.title.message}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="mainImage" className={styles.label}>
          대표 이미지 <span className={styles.required}>*</span>
        </label>
        <MainImageUpload onImageUpload={handleMainImageUpload} />
      </div>

      <IntroMediaUpload />

      {/* Summary input */}
      <div className={styles.inputGroup}>
        <label htmlFor="summary" className={styles.label}>
          Summary
        </label>
        <input
          type="text"
          id="summary"
          {...register("summary")}
          className={styles.input}
          placeholder="프로젝트 요약을 입력하세요"
        />
      </div>

      {/* Product Story Component */}
      <ProductStory control={control} errors={errors} />

      {/* Tags input */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          검색용 태그(#) <span className={styles.required}>*</span>
        </label>
        <div className={styles.tagContainer}>
          {formData.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
              <button
                onClick={() => removeTag(index)}
                className={styles.removeTagButton}
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            id="tags"
            onKeyPress={handleTagInput}
            className={styles.tagInput}
            placeholder="엔터를 누르면 최대 10개까지 태그를 입력할 수 있어요"
          />
        </div>
        <p className={styles.tagCount}>{formData.tags.length}/10개의 태그</p>
      </div>
    </div>
  );
};

export default StoryWriting;
