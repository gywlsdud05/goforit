import useDuckFundingAuthStore from "../store/useDuckFundingAuthStore";
import styles from "./Favorites.module.css";
import React from "react";

const Favorites = () => {
  const { user, logout } = useDuckFundingAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내 위시리스트</h1>
      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.buttonActive}`}>
          전체
        </button>
        <button className={`${styles.button} ${styles.buttonInactive}`}>
          팔람 스토어
        </button>
        <button className={`${styles.button} ${styles.buttonInactive}`}>
          팔람 빈티지
        </button>
        <button className={`${styles.button} ${styles.buttonInactive}`}>
          알림신청
        </button>
        <button className={`${styles.button} ${styles.buttonInactive}`}>
          팔로잉 메이커
        </button>
      </div>
      <div className={styles.emptyState}>팔람 프로젝트가 없어요</div>
    </div>
  );
};

export default Favorites;
