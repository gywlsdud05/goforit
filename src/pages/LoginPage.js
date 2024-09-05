import React, { useState } from 'react';
import { Apple, Facebook } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabase.client';
import useAuthStore from '../store/useAuthStore';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuthStore((state) => ({
    login: state.login,
    error: state.error,
  }));

  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log('Successfully logged in!');
      navigate('/DuckFundingHome');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/AuthCallback`
        }
      });

      if (error) throw error;
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        console.error(`${provider} login failed: No URL returned`);
      }
    } catch (error) {
      console.error(`Error starting ${provider} login:`, error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>로그인</h1>
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <div className={styles.forgotPassword}>
          <a href="#" className={styles.forgotPasswordLink}>
            로그인 정보를 잊으셨나요?
          </a>
        </div>
        <button
          type="submit"
          className={`${styles.button} ${styles.emailLoginButton}`}
        >
          이메일로 로그인하기
        </button>
      </form>
      <button onClick={() => handleSocialLogin('kakao')} className={`${styles.button} ${styles.kakaoButton}`}>
        <span className="mr-2">🗨️</span> 카카오로 시작하기
      </button>
      <button onClick={() => handleSocialLogin('naver')} className={`${styles.button} ${styles.naverButton}`}>
        <span className="mr-2 font-bold text-lg">N</span> 네이버로 시작하기
      </button>
      <div className={styles.socialButtonsContainer}>
        <button 
          onClick={() => handleSocialLogin('google')}
          className={`${styles.socialButton} ${styles.googleButton}`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          <div>임시 : 구글로그인 입니다</div>
        </button>
        <button onClick={() => handleSocialLogin('facebook')} className={`${styles.socialButton} ${styles.facebookButton}`}>
          <Facebook className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => handleSocialLogin('apple')} className={`${styles.socialButton} ${styles.appleButton}`}>
          <Apple className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className={styles.signupContainer}>
        <span className={styles.signupText}>아직 와디즈 계정이 없나요? </span>
        <Link to="/SignUpPage" className={styles.signupLink}>
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;