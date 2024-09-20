// src/store/DuckChatAuthStore.js
import { supabase } from "../supabase.client";

const DuckChatAuthStore = {
  // 소셜 로그인 (카카오, 디스코드 포함)
  signInWithSocial: async (provider) => {
    let data, error;

    switch (provider) {
      case "kakao":
        ({ data, error } = await supabase.auth.signInWithOAuth({
          provider: "kakao",
        }));
        break;
      case "discord":
        ({ data, error } = await supabase.auth.signInWithOAuth({
          provider: "discord",
        }));
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    if (error) throw error;
    return data;
  },

  // 현재 세션 가져오기
  getSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  // 사용자 프로필 가져오기
  fetchUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("chatUsers")
        .select("nickname, avatarUrl, email")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("User profile not found. Creating a new one.");
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  // 사용자 프로필 생성 또는 업데이트
  upsertUserProfile: async (id, nickname, avatarUrl, email) => {
    try {
      const { data, error } = await supabase.from("chatUsers").upsert(
        {
          user_id: id,
          nickname,
          avatarUrl,
          email,
        },
        {
          onConflict: "user_id",
          returning: "minimal", // 데이터를 반환하지 않도록 설정
        }
      );

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error upserting user profile:", error);
      return { success: false, error };
    }
  },

  // 인증 상태 변경 리스너 설정
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const { id, email, user_metadata } = session.user;
          let nickname =
            user_metadata.full_name ||
            user_metadata.name ||
            email.split("@")[0];
          let avatarUrl = user_metadata.avatar_url || user_metadata.picture;

          // 프로필 생성 또는 업데이트
          await DuckChatAuthStore.upsertUserProfile(
            id,
            nickname,
            avatarUrl,
            email
          );

          // 프로필 가져오기
          const userProfile = await DuckChatAuthStore.fetchUserProfile(id);

          callback({ event, session, userProfile });
        } catch (error) {
          console.error("Error handling auth state change:", error);
          callback({ event, session, userProfile: null });
        }
      } else if (event === "SIGNED_OUT") {
        callback({ event, session: null, userProfile: null });
      }
    });
  },

  // 이메일/비밀번호 로그인
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // 로그아웃
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 초기화 함수 (App.js에서 사용)
  initializeAuth: async () => {
    const session = await DuckChatAuthStore.getSession();
    if (session) {
      const userProfile = await DuckChatAuthStore.fetchUserProfile(
        session.user.id
      );
      return { session, userProfile };
    }
    return null;
  },

  // 인증 콜백 처리 (App.js에서 사용)
  handleAuthCallback: async ({ access_token }) => {
    const { data, error } = await supabase.auth.setSession({ access_token });
    if (error) throw error;
    return data;
  },
};

export default DuckChatAuthStore;
