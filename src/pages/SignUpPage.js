import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase.client';
import { useForm } from "react-hook-form";
import Identicon from 'identicon.js';

const SignupForm = () => {

    const { register, handleSubmit, getValues, reset, setFocus, formState: { errors } } = useForm();


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const generateIdenticon = (inputString) => {
        const hash = new Identicon(inputString).toString(); // Identicon 생성
        return `data:image/png;base64,${hash}`; // Base64로 인코딩된 이미지 데이터 반환
      };



  const onSubmit = async (data) => {
    const { email, nickname } = data; // 폼 데이터에서 email과 nickname 추출
    const avatarUrl = generateIdenticon(email);// 이메일을 기반으로 Identicon 생성


    try {
      // Supabase sign up API call
      const { user, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) {
        throw signUpError;
      }

    // Supabase에 데이터 삽입
    const { error: insertError } = await supabase
      .from('users')  // 'users' 테이블에 삽입
      .insert([{ nickname, avatarUrl: avatarUrl }]);

      if (insertError) throw insertError;

      setSuccess('Sign up successful! Please check your email for verification.');
      reset();
    } catch (error) {
      setError(error.message);
      setFocus('email'); // Focus on email field when there's an error
    }
    
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">이메일 간편가입</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="email"
              id="email"
              className="flex-1 block w-full rounded-md sm:text-sm border-gray-300"
              placeholder="이메일 계정"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <div>{errors.email.message}</div>}

            <button
              type="button"
              className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              인증하기
            </button>
          </div>
        </div>

        {/* Nickname field */}
        <div className="mb-4">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">닉네임</label>
          <input
            type="text"
            id="nickname"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            placeholder="닉네임 입력"
            {...register('nickname', {    
                required: '닉네임을 입력해주세요.',
                // required: true,
                // boolean값도 가능하지만 문자열 값을 주면, input의 value가 없을 때 해당 문자열이 errors 객체로 반환되어 에러 메세지로 표시할 수 있다.
                minLength: { // value의 최소 길이
                  value: 3,
                  message: '3글자 이상 입력해주세요.', // 에러 메세지
                },
                pattern: { // input의 정규식 패턴
                  value: /^[A-za-z0-9가-힣]{3,10}$/,
                  message: '가능한 문자: 영문 대소문자, 글자 단위 한글, 숫자', // 에러 메세지
                },
              })}
          />
{errors.nickname && <div className="text-red-500 text-sm mt-1">{errors.nickname.message}</div>} {/* validation fail 시 에러 메세지 표시 */}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="비밀번호 입력"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
            />
            {errors.password && <div>{errors.password.message}</div>}
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Confirm Password field */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="비밀번호 확인"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) =>
                  value === getValues('password') || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
            <div>{errors.confirmPassword.message}</div>
             )}
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>

        {error && <div>{error}</div>}
      {success && <div>{success}</div>}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            약관 동의후 가입 완료하기
          </button>
        </div>
      </form>
    </div>
  );
};



export default SignupForm;