import useProductWriteStore from "../../store/useProductWriteStore";
import styles from "./RewardDesign.module.css";
import React from "react";
import { useForm } from "react-hook-form";

const RewardDesign = () => {
  const { formData, updateRewardDesign } = useProductWriteStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { price: formData.price },
  });

  const onSubmit = (data) => {
    updateRewardDesign("price", data.price);
    // 여기에 다른 제출 로직을 추가할 수 있습니다.
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>리워드 설계</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            가격 <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              id="price"
              className={styles.input}
              placeholder="리워드 가격을 입력하세요"
              {...register("price", {
                required: "가격은 필수입니다.",
                min: {
                  value: 1000,
                  message: "최소 1,000원 이상이어야 합니다.",
                },
                max: {
                  value: 1000000,
                  message: "최대 1,000,000원 이하여야 합니다.",
                },
                valueAsNumber: true,
              })}
            />
            <span className={styles.currency}>원</span>
          </div>
          {errors.price && (
            <p className={styles.errorMessage}>{errors.price.message}</p>
          )}
          <p className={styles.helpText}>
            1,000원 ~ 1,000,000원 사이에서 설정해 주세요.
          </p>
        </div>

        {/* 여기에 추가적인 리워드 관련 필드들을 넣을 수 있습니다. */}

        <button type="submit" className={styles.submitButton}>
          저장
        </button>
      </form>
    </div>
  );
};

export default RewardDesign;
