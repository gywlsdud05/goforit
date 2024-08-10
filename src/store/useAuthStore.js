// src/store/useAuthStore.js
import create from 'zustand';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = 'https://vrjeaqcpjjqotxntpatt.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  user: null,

  // 로그인 메서드
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      set({ accessToken: null, refreshToken: null, user: null });
      return;
    }

    const { session, user } = data;
    localStorage.setItem('accessToken', session.access_token);
    localStorage.setItem('refreshToken', session.refresh_token);

    set({ accessToken: session.access_token, refreshToken: session.refresh_token, user });
  },

  // 로그아웃 메서드
  logout: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error.message);
      return;
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ accessToken: null, refreshToken: null, user: null });
  },

  // 액세스 토큰 갱신 메서드
  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

    if (error) {
      console.error('Refresh token error:', error.message);
      set({ accessToken: null, refreshToken: null });
      return;
    }

    const { session } = data;
    localStorage.setItem('accessToken', session.access_token);
    set({ accessToken: session.access_token });
  },
}));

export default useAuthStore;
