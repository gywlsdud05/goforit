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
    price: "",
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

  uploadToSupabase: async (file, bucket = "product-image") => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },

  uploadIntroPictures: async (files) => {
    const { formData, setFormData, uploadToSupabase } = get();

    const uploadPromises = files.map(async (file) => {
      const publicUrl = await uploadToSupabase(file);
      return {
        id: Date.now() + Math.random(),
        url: publicUrl,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    const newIntroPictures = [
      ...(formData.introPictures || []),
      ...uploadedImages,
    ].slice(0, 10);

    setFormData({ introPictures: newIntroPictures });
    await get().updateIntroVisualsInDatabase(newIntroPictures);
  },

  uploadMainImage: async (file) => {
    const { setFormData, uploadToSupabase } = get();

    const publicUrl = await uploadToSupabase(file);
    setFormData({ mainImage: publicUrl });
    await get().updateMainImageInDatabase(publicUrl);
  },

  removeIntroPicture: async (id) => {
    const { formData, setFormData, updateIntroVisualsInDatabase } = get();

    const pictureToRemove = formData.introPictures.find((pic) => pic.id === id);
    if (pictureToRemove) {
      await supabase.storage
        .from("product-image")
        .remove([pictureToRemove.url.split("/").pop()]);
    }

    const updatedPictures = formData.introPictures.filter(
      (pic) => pic.id !== id
    );
    setFormData({ introPictures: updatedPictures });
    await updateIntroVisualsInDatabase(updatedPictures);
  },

  removeMainImage: async () => {
    const { formData, setFormData, updateMainImageInDatabase } = get();

    if (formData.mainImage) {
      const fileName = formData.mainImage.split("/").pop();
      await supabase.storage.from("product-image").remove([fileName]);
    }

    setFormData({ mainImage: null });
    await updateMainImageInDatabase(null);
  },

  updateIntroVisualsInDatabase: async (introPictures) => {
    const { formData } = get();
    const { data, error } = await supabase
      .from("product")
      .update({ introVisuals: introPictures.map((pic) => pic.url) })
      .eq("id", formData.id);

    if (error) {
      console.error("Error updating introVisuals:", error);
      throw error;
    }
  },

  updateMainImageInDatabase: async (mainImageUrl) => {
    const { formData } = get();
    const { data, error } = await supabase
      .from("product")
      .update({ mainImage: mainImageUrl })
      .eq("id", formData.id);

    if (error) {
      console.error("Error updating mainImage:", error);
      throw error;
    }
  },

  editIntroPicture: async (id, editedImageBlob) => {
    const {
      formData,
      setFormData,
      uploadToSupabase,
      updateIntroVisualsInDatabase,
    } = get();

    const file = new File([editedImageBlob], `edited_image_${id}.jpg`, {
      type: "image/jpeg",
    });
    const publicUrl = await uploadToSupabase(file);

    const updatedPictures = formData.introPictures.map((pic) =>
      pic.id === id ? { ...pic, url: publicUrl } : pic
    );

    setFormData({ introPictures: updatedPictures });
    await updateIntroVisualsInDatabase(updatedPictures);
  },

  editMainImage: async (editedImageBlob) => {
    const {
      formData,
      setFormData,
      uploadToSupabase,
      updateMainImageInDatabase,
    } = get();

    const file = new File([editedImageBlob], `edited_main_image.jpg`, {
      type: "image/jpeg",
    });
    const publicUrl = await uploadToSupabase(file);

    // 이전 이미지 삭제
    if (formData.mainImage) {
      const oldFileName = formData.mainImage.split("/").pop();
      await supabase.storage.from("product-image").remove([oldFileName]);
    }

    setFormData({ mainImage: publicUrl });
    await updateMainImageInDatabase(publicUrl);
  },

  updateRewardDesign: (field, value) =>
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

  setPrice: (price) => set({ price }),

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
        price: "",
      },
      isValid: false,
    });
  },
}));

export default useProductWriteStore;
