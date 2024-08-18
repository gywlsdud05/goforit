import React, { useState } from 'react';
import { Apple, Facebook } from 'lucide-react';
import {Routes, Route, Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabase.client';
import useAuthStore from '../store/useAuthStore';

  
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, error, googleLogin } = useAuthStore((state) => ({
    login: state.login,
    googleLogin: state.googleLogin,
    user: state.user,
  }));

  const navigate = useNavigate(); // useNavigate 훅 추가
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
        await login(email, password);
        console.log('Successfully logged in!');
        navigate('/DuckFundingHome'); // 로그인 후 홈으로 리디렉션
      } catch (error) {
        console.error('Error logging in:', error.message);
      }
  };
  // const handleGoogleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await googleLogin();
  //       console.log('Successfully logged in!');
  //       //navigate('/DuckFundingHome'); // 로그인 후 홈으로 리디렉션
  //     } catch (error) {
  //       console.error('Error logging in:', error.message);
  //     }
  // };
  // const handleGoogleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { url } = await googleLogin();
  //     window.location.href = url;
  //   } catch (error) {
  //     console.error('Error starting Google login:', error.message);
  //   }
  // };
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await googleLogin();
      console.log('Google login result:', result);
      if (result && result.url) {
        window.location.href = result.url;
      } else {
        console.error('Google login failed: No URL returned');
      }
    } catch (error) {
      console.error('Error starting Google login:', error);
    }
  };



  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="text-right mb-4">
          <a href="#" className="text-sm text-gray-600 hover:underline">
            로그인 정보를 잊으셨나요?
          </a>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 mb-4"
        >
          이메일로 로그인하기
        </button>
      </form>
      <button className="w-full py-2 px-4 bg-yellow-400 text-black rounded hover:bg-yellow-500 mb-4 flex items-center justify-center">
        <span className="mr-2">🗨️</span> 카카오로 시작하기
      </button>
      <button className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 mb-4 flex items-center justify-center">
        <span className="mr-2 font-bold text-lg">N</span> 네이버로 시작하기
      </button>
      <div className="flex justify-center space-x-4 mt-6">
        <button 
        onClick={handleGoogleLogin}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
        </button>
        <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-700">
          <Facebook className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 rounded-full bg-gray-900 hover:bg-black">
          <Apple className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="text-center mt-6">
        <span className="text-sm text-gray-600">아직 와디즈 계정이 없나요? </span>
        <Link to="/SignUpPage" className="text-sm text-blue-600 hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;