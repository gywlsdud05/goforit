// AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase.client';
import Identicon from 'identicon.js';
import useAuthStore from '../store/useAuthStore';

const generateIdenticon = (inputString) => {
    const hash = new Identicon(inputString).toString(); // Identicon 생성
    return `data:image/png;base64,${hash}`; // Base64로 인코딩된 이미지 데이터 반환
  };

const AuthCallback = () => {
  const { set } = useAuthStore((state) => ({
    set: state.set,
}));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error.message);
          return;
      }

        if (session) {
          const { user } = session;

          // 닉네임은 user 객체에서 가져옵니다.
          const nickname = user.user_metadata.name || user.email.split('@')[0];
          const avatarUrl = user.user_metadata.avatar_url || generateIdenticon(user.email);

          // 사용자 데이터 삽입 또는 업데이트
          const { error: upsertError } = await supabase
            .from('users')
            .upsert({
              user_id: user.id,
              nickname: nickname,
              avatarUrl: avatarUrl,
              email: user.email
            }, { onConflict: 'user_id' });

          if (upsertError) throw upsertError;

           // 상태 업데이트
           set({
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            user: user
          });

          console.log('User data inserted/updated successfully');
          //navigate('/DuckFundingHome');  
        }
      } catch (error) {
        console.error('Auth callback error:', error.message);
        //navigate('/LoginPage');  // 에러 발생시 로그인 페이지로 이동
      }
    };

    //handleAuthCallback();
  }, [navigate]);

  return <div>Processing loading...</div>;  
};

export default AuthCallback;