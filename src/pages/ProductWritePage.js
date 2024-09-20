import useAuthStore from "../store/useDuckFundingAuthStore";
import useProductWriteStore from "../store/useProductWriteStore";
import { supabase } from "../supabase.client";
import ProductWriteFooter from "./ProductWriteFooter";
import ProductWriteHeader from "./ProductWriteHeader";
import ProductWriteSidebar from "./ProductWriteSidebar";
import ProjectInfo from "./makerField/ProjectInfo";
import RewardDesign from "./makerField/RewardDesign";
import StoryWriting from "./makerField/StoryWriting";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

const sections = [
  { id: "projectInfo", title: "프로젝트 정보" },
  { id: "storyWriting", title: "스토리 작성" },
  { id: "rewardDesign", title: "리워드 설계" },
];

const ProductWritePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState(id);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const {
    activeSection,
    setActiveSection,
    setFormData,
    setIsValid,
    onTemporarySave,
    onSubmit,
    isValid,
  } = useProductWriteStore();

  const { user } = useAuthStore();

  useEffect(() => {
    const createNewProject = async () => {
      if (!id && user) {
        const { data, error } = await supabase
          .from("products")
          .insert({
            maker_id: user.user_id,
            status: "pending",
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating new project:", error);
          return;
        }

        const newProjectId = data.id;
        setProjectId(newProjectId);
        navigate(`/ProductWritePage/${newProjectId}`, {
          replace: true,
        });
      }
    };

    createNewProject();
  }, [id, user, navigate]);

  useEffect(() => {
    useProductWriteStore.getState().setUser(user);
  }, [user]);

  const onSectionClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    onSubmit();
  };

  useEffect(() => {
    const subscription = watch((value) => {
      setFormData(value);
      setIsValid(Object.keys(errors).length === 0);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData, setIsValid, errors]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "projectInfo":
        return (
          <ProjectInfo control={control} register={register} errors={errors} />
        );
      case "storyWriting":
        return (
          <StoryWriting
            control={control}
            register={register}
            errors={errors}
            watch={watch}
          />
        );
      case "rewardDesign":
        return (
          <RewardDesign control={control} register={register} errors={errors} />
        );
      default:
        return null;
    }
  };

  if (!projectId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ProductWriteHeader id={projectId} />
      <div className="flex flex-1">
        <ProductWriteSidebar
          sections={sections}
          activeSection={activeSection}
          onSectionClick={onSectionClick}
        />
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {renderActiveSection()}
          </form>
        </div>
      </div>
      <ProductWriteFooter
        onTemporarySave={onTemporarySave}
        onSubmit={handleSubmit(handleFormSubmit)}
        isValid={isValid}
      />
    </div>
  );
};

export default ProductWritePage;
