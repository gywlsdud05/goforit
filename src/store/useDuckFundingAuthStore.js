import { supabase } from "../supabase.client";
import { create } from "zustand";

const useDuckFundingAuthStore = create((set, get) => ({
  session: null,
  user: null,
  error: null,

  setUser: (user) => set({ user }),

  setError: (error) => set({ error }),

  fetchUserData: async (userId) => {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      if (!userData || userData.length === 0) {
        console.warn(`No user data found for user_id: ${userId}`);
        return null;
      }

      if (userData.length > 1) {
        console.warn(
          `Multiple entries found for user_id: ${userId}. Using the first entry.`
        );
      }

      return userData[0]; // Return the first (or only) user data object
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        const userData = await get().fetchUserData(session.user.id);
        set({
          session,
          user: userData ? { ...session.user, ...userData } : session.user,
          error: null,
        });
      } else {
        set({ session: null, user: null, error: null });
      }
    } catch (error) {
      console.error("Initialize auth error:", error.message);
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
        error: null,
      });

      return user;
    } catch (err) {
      console.error("Login error:", err.message);
      set({ error: err.message });
    }
  },

  socialLogin: async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/AuthCallback`,
          queryParans: {
            acces_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;

      // The actual authentication will be handled in handleAuthCallback
      return data;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      set({ error: `Failed to login with ${provider}. Please try again.` });
      throw error;
    }
  },

  handleUserAuthentication: async (authUser) => {
    try {
      console.log("authuser:", authUser);
      // Check if user exists in our database
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is the error code for no rows returned
        throw fetchError;
      }

      let userData;
      console.log("New user registered:", userData);
      if (!existingUser) {
        // User doesn't exist, create a new user
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              user_id: authUser.id,
              email: authUser.email,
              nickname:
                authUser.user_metadata?.full_name ||
                authUser.user_metadata?.name ||
                authUser.raw_user_meta_data?.name ||
                "",
              avatarUrl:
                authUser.user_metadata?.avatar_url ||
                authUser.raw_user_meta_data?.avatar_url ||
                "",
              // Add any other fields you want to store
            },
          ])
          .single();

        if (insertError) throw insertError;

        userData = newUser;
        console.log("New user registered:", userData);
      } else {
        // User exists, update the existing data
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({
            email: authUser.email,
            nickname:
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
              existingUser.nickname,
            avatarUrl:
              authUser.user_metadata?.avatar_url || existingUser.avatar_url,
            // Update any other fields as needed
          })
          .eq("user_id", authUser.id)
          .single();

        if (updateError) throw updateError;

        userData = updatedUser;
        console.log("Existing user updated:", userData);
      }

      // Set the session and user data
      set({
        session: { user: authUser },
        user: { ...authUser, ...userData },
        error: null,
      });
    } catch (error) {
      console.error("Error in handleUserAuthentication:", error.message);
      set({ error: "Failed to process authentication. Please try again." });
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, user: null, error: null });
    } catch (error) {
      console.error("Logout error:", error.message);
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
          error: null,
        });
        return session.user;
      } else {
        throw new Error("Failed to refresh session");
      }
    } catch (error) {
      console.error("Refresh session error:", error.message);
      set({
        session: null,
        user: null,
        error: "Session expired. Please log in again.",
      });
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
      console.error("Password reset error:", error.message);
      set({ error: "Failed to send password reset email. Please try again." });
    }
  },
}));

export default useDuckFundingAuthStore;
