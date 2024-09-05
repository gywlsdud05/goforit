import { supabase } from "../supabase.client";
import { create } from "zustand";

const useProductWriteStore = create((set, get) => ({
  activeSection: "projectInfo",
  formData: {
    mainCategory: "",
    subCategory: "",
    goalAmount: "",
    title: "",
    mainImage: null,
    introType: "video",
    videoUrl: "",
    introPictures: [],
    summary: "",
    body: "",
    tags: [],
  },
  isValid: false,
  user: null,

  setActiveSection: (sectionId) => set({ activeSection: sectionId }),

  setFormData: (data) => set({ formData: { ...get().formData, ...data } }),

  setIsValid: (isValid) => set({ isValid }),

  setUser: (user) => set({ user }),

  updateProjectInfo: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  updateStoryWriting: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  addTag: (tag) =>
    set((state) => ({
      formData: {
        ...state.formData,
        tags: [...state.formData.tags, tag].slice(0, 10),
      },
    })),

  removeTag: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        tags: state.formData.tags.filter((_, i) => i !== index),
      },
    })),

  onTemporarySave: async () => {
    const { formData, user } = get();
    try {
      if (!user || !user.user_id) {
        throw new Error("User not authenticated");
      }
      const { data, error } = await supabase.from("temporary_products").upsert([
        {
          maker_id: user.user_id,
          form_data: formData,
        },
      ]);
      if (error) throw error;
      alert("임시저장 되었습니다.");
      return data;
    } catch (error) {
      console.error("임시저장 중 오류 발생:", error);
      alert("임시저장 중 오류가 발생했습니다.");
      throw error;
    }
  },

  loadTemporarySave: async () => {
    const { user } = get();
    try {
      if (!user || !user.user_id) {
        throw new Error("User not authenticated");
      }
      const { data, error } = await supabase
        .from("temporary_products")
        .select("form_data")
        .eq("maker_id", user.user_id)
        .single();
      if (error) throw error;
      if (data && data.form_data) {
        set({ formData: data.form_data });
        return data.form_data;
      }
    } catch (error) {
      console.error("임시저장 불러오기 중 오류 발생:", error);
      alert("임시저장 불러오기 중 오류가 발생했습니다.");
      throw error;
    }
  },

  onSubmit: async () => {
    const { formData, user } = get();
    try {
      if (!user || !user.user_id) {
        throw new Error("User not authenticated");
      }
      const { data, error } = await supabase.from("products").insert([
        {
          ...formData,
          maker_id: user.user_id,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      alert("프로젝트가 성공적으로 등록되었습니다.");
      return data;
    } catch (error) {
      console.error("프로젝트 등록 중 오류 발생:", error);
      alert("프로젝트 등록 중 오류가 발생했습니다.");
      throw error;
    }
  },

  validateForm: () => {
    const { formData } = get();
    const isValid =
      formData.mainCategory &&
      formData.subCategory &&
      formData.goalAmount &&
      formData.title &&
      formData.mainImage &&
      ((formData.introType === "video" && formData.videoUrl) ||
        (formData.introType === "picture" &&
          formData.introPictures.length > 0)) &&
      formData.summary &&
      formData.body;
    set({ isValid });
    return isValid;
  },

  resetForm: () => {
    set({
      formData: {
        mainCategory: "",
        subCategory: "",
        goalAmount: "",
        title: "",
        mainImage: null,
        introType: "video",
        videoUrl: "",
        introPictures: [],
        summary: "",
        body: "",
        tags: [],
      },
      isValid: false,
    });
  },
}));

export default useProductWriteStore;
