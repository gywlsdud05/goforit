import create from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vrjeaqcpjjqotxntpatt.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

const useAuthStore = create((set, get) => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: null,
    error: null,

    setError: (error) => set({ error }),

    login: async (email, password) => {
        try {
            // 먼저 사용자가 존재하는지 확인
            const { data: userExists, error: userCheckError } = await supabase
                .from('users')
                .select('email')
                .eq('email', email)
                .single();

            if (userCheckError || !userExists) {
                set({ error: "Account does not exist. Please sign up." });
                return;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message === "Email not confirmed") {
                    set({ error: "Please confirm your email before logging in." });
                } else {
                    set({ error: "Invalid login credentials. Please try again." });
                }
                return;
            }

            const { session, user } = data;
            localStorage.setItem('accessToken', session.access_token);
            localStorage.setItem('refreshToken', session.refresh_token);

            set({ accessToken: session.access_token, refreshToken: session.refresh_token, user, error: null });
        } catch (err) {
            console.error('Login error:', err.message);
            set({ error: "An unexpected error occurred. Please try again." });
        }
    },

    googleLogin: async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/authCallback`,
                },
            });

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Google login error:', error);
            set({ error: "Failed to login with Google. Please try again." });
            throw error;
        }
    },

    handleAuthCallback: async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            if (session) {
                localStorage.setItem('accessToken', session.access_token);
                localStorage.setItem('refreshToken', session.refresh_token);
                set({ accessToken: session.access_token, refreshToken: session.refresh_token, user: session.user, error: null });
            }
        } catch (error) {
            console.error('Auth callback error:', error.message);
            set({ accessToken: null, refreshToken: null, user: null, error: "Authentication failed. Please try logging in again." });
            throw error;
        }
    },

    logout: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({ accessToken: null, refreshToken: null, user: null, error: null });
        } catch (error) {
            console.error('Logout error:', error.message);
            set({ error: "Failed to log out. Please try again." });
        }
    },

    refreshAccessToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error("No refresh token available");

            const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

            if (error) throw error;

            const { session } = data;
            localStorage.setItem('accessToken', session.access_token);
            set({ accessToken: session.access_token, error: null });
        } catch (error) {
            console.error('Refresh token error:', error.message);
            set({ accessToken: null, refreshToken: null, error: "Session expired. Please log in again." });
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