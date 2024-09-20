import styles from "./LoginModal.module.css";
import React, { useState } from "react";

const LoginModal = ({ onClose, onSocialLogin, onEmailPasswordLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onEmailPasswordLogin(email, password);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">로그인</button>
        </form>
        <div className={styles.socialLogin}>
          <button
            onClick={() => onSocialLogin("kakao")}
            className={styles.kakaoButton}
          >
            카카오로 로그인
          </button>
          <button
            onClick={() => onSocialLogin("discord")}
            className={styles.discordButton}
          >
            디스코드로 로그인
          </button>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
