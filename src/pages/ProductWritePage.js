import React from 'react';
import { useForm } from 'react-hook-form';
import useProductWriteStore from '../store/useProductWriteStore';
import useAuthStore from '../store/useAuthStore';
import ProjectInfo from './makerField/ProjectInfo';
import StoryWriting from './makerField/StoryWriting';
import RewardDesign from './makerField/RewardDesign';
import ProductWriteSidebar from './ProductWriteSidebar';
import ProductWriteFooter from './ProductWriteFooter';

const sections = [
  { id: 'projectInfo', title: '프로젝트 정보' },
  { id: 'storyWriting', title: '스토리 작성' },
  { id: 'rewardDesign', title: '리워드 설계' },
];

const ProductWritePage = () => {
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const { 
    activeSection, 
    setActiveSection, 
    setFormData, 
    setIsValid, 
    onTemporarySave, 
    onSubmit,
    isValid 
  } = useProductWriteStore();

  const { user } = useAuthStore();

  React.useEffect(() => {
    useProductWriteStore.getState().setUser(user);
  }, [user]);

  const onSectionClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    onSubmit();
  };

  React.useEffect(() => {
    const subscription = watch((value) => {
      setFormData(value);
      setIsValid(Object.keys(errors).length === 0);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData, setIsValid, errors]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'projectInfo':
        return <ProjectInfo control={control} register={register} errors={errors} />;
      case 'storyWriting':
        return <StoryWriting control={control} register={register} errors={errors} watch={watch} />;
      case 'rewardDesign':
        return <RewardDesign control={control} register={register} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
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
      <ProductWriteFooter
        onTemporarySave={onTemporarySave}
        onSubmit={handleSubmit(handleFormSubmit)}
        isValid={isValid}
      />
    </div>
  );
};

export default ProductWritePage;