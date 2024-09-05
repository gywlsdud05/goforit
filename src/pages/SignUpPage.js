import React, { useState } from 'react';
import { Eye, EyeOff, Apple } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { supabase } from '../supabase.client';
import { useForm } from "react-hook-form";
import Identicon from 'identicon.js';
import { useNavigate } from 'react-router-dom';
import styles from './SignupForm.module.css';

const SignupForm = () => {
  const { register, handleSubmit, getValues, reset, setFocus, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const generateIdenticon = (inputString) => {
    const hash = new Identicon(inputString).toString();
    return `data:image/png;base64,${hash}`;
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
      window.location.href = data.url;
    } catch (error) {
      console.error(`${provider} login error:`, error.message);
    }
  };

  const handleKakaoLogin = () => handleSocialLogin('kakao');
  const handleNaverLogin = () => handleSocialLogin('naver');
  const handleGoogleLogin = () => handleSocialLogin('google');
  const handleFacebookLogin = () => handleSocialLogin('facebook');
  const handleAppleLogin = () => handleSocialLogin('apple');

  const onSubmit = async (data) => {
    const { email, nickname, password } = data;
    const avatarUrl = generateIdenticon(email);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ 
          user_id: authData.user.id, 
          email, 
          nickname, 
          avatarUrl 
        }]);

      if (userError) throw userError;

      setSuccess('Sign up successful! Please check your email for verification.');
      reset();
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      setFocus('email');
    }
  };

  return (
    <div className={styles.container}>
      <img src="/api/placeholder/120/40" alt="Wadiz logo" className={styles.logo} />

      <button onClick={handleKakaoLogin} className={`${styles.socialButton} ${styles.kakaoButton}`}>
        <span className="mr-2">🗨️</span>
        카카오로 시작하기
      </button>

      <button onClick={handleNaverLogin} className={`${styles.socialButton} ${styles.naverButton}`}>
        <span className="font-bold mr-2">N</span>
        네이버로 시작하기
      </button>

      <div className={styles.socialIconsContainer}>
        <button
          onClick={handleGoogleLogin}
          className={`${styles.socialIconButton} ${styles.googleButton}`}
        >
          <FontAwesomeIcon icon={faGoogle} size="lg" />
        </button>
        <button onClick={handleFacebookLogin} className={`${styles.socialIconButton} ${styles.facebookButton}`}>
          <FontAwesomeIcon icon={faFacebook} size="lg" color="white" />
        </button>
        <button onClick={handleAppleLogin} className={`${styles.socialIconButton} ${styles.appleButton}`}>
          <Apple size={24} color="white" />
        </button>
      </div>

      <h2 className={styles.title}>이메일 간편가입</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>이메일</label>
          <div className={styles.inputWithButton}>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="이메일 계정"
              {...register('email', { required: 'Email is required' })}
            />
            <button
              type="button"
              className={styles.verifyButton}
            >
              인증하기
            </button>
          </div>
          {errors.email && <div className={styles.error}>{errors.email.message}</div>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nickname" className={styles.label}>닉네임</label>
          <input
            type="text"
            id="nickname"
            className={styles.input}
            placeholder="닉네임 입력"
            {...register('nickname', {
              required: '닉네임을 입력해주세요.',
              minLength: {
                value: 3,
                message: '3글자 이상 입력해주세요.',
              },
              pattern: {
                value: /^[A-za-z0-9가-힣]{3,10}$/,
                message: '가능한 문자: 영문 대소문자, 글자 단위 한글, 숫자',
              },
            })}
          />
          {errors.nickname && <div className={styles.error}>{errors.nickname.message}</div>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>비밀번호</label>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={styles.input}
              placeholder="비밀번호 입력"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {errors.password && <div className={styles.error}>{errors.password.message}</div>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>비밀번호 확인</label>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className={styles.input}
              placeholder="비밀번호 확인"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) =>
                  value === getValues('password') || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className={styles.error}>{errors.confirmPassword.message}</div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <button
          type="submit"
          className={styles.submitButton}
        >
          약관 동의후 가입 완료하기
        </button>
      </form>
    </div>
  );
};

export default SignupForm;