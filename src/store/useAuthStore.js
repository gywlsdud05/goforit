import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vrjeaqcpjjqotxntpatt.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey);

const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  error: null,

  setUser: (user) => set({ user }),

  setError: (error) => set({ error }),

  fetchUserData: async (userId) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();
  
      if (error) throw error;
  
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        const userData = await get().fetchUserData(session.user.id);
        set({ session, user: { ...session.user, ...userData }, error: null });
      } else {
        set({ session: null, user: null, error: null });
      }
    } catch (error) {
      console.error('Initialize auth error:', error.message);
      set({ session: null, user: null, error: error.message });
    }
  },

  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { session, user } = data;
      
      const userData = await get().fetchUserData(user.id);

      set({ 
        session,
        user: { ...user, ...userData }, 
        error: null 
      });

      return user;
    } catch (err) {
      console.error('Login error:', err.message);
      set({ error: err.message });
    }
  },

  socialLogin: async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/AuthCallback`,
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      set({ error: `Failed to login with ${provider}. Please try again.` });
      throw error;
    }
  },

  handleAuthCallback: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        const userData = await get().fetchUserData(session.user.id);
        set({ session, user: { ...session.user, ...userData }, error: null });
        return session.user;
      } else {
        throw new Error('No session found');
      }
    } catch (error) {
      console.error('Auth callback error:', error.message);
      set({ session: null, user: null, error: error.message });
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, user: null, error: null });
    } catch (error) {
      console.error('Logout error:', error.message);
      set({ error: "Failed to log out. Please try again." });
    }
  },

  refreshSession: async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) throw error;

      if (data && data.session) {
        const { session } = data;
        const userData = await get().fetchUserData(session.user.id);

        set({ 
          session,
          user: { ...session.user, ...userData }, 
          error: null 
        });
        return session.user;
      } else {
        throw new Error('Failed to refresh session');
      }
    } catch (error) {
      console.error('Refresh session error:', error.message);
      set({ session: null, user: null, error: "Session expired. Please log in again." });
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      set({ error: null });
      return "Password reset email sent. Please check your inbox.";
    } catch (error) {
      console.error('Password reset error:', error.message);
      set({ error: "Failed to send password reset email. Please try again." });
    }
  },
}));

export default useAuthStore;