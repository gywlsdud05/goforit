import useProductWriteStore from "../../store/useProductWriteStore";
import ImageEditor from "./ImageEditor";
import styles from "./IntroMediaUpload.module.css";
import { Pencil } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

const IntroMediaUpload = () => {
  const {
    formData,
    updateStoryWriting,
    uploadIntroPictures,
    removeIntroPicture,
    editIntroPicture,
  } = useProductWriteStore();
  const pictureInputRef = useRef(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);

  useEffect(() => {
    if (!formData.videoUrl) {
      updateStoryWriting("videoUrl", "");
    }
  }, []);

  const handleVideoUrlChange = (e) => {
    updateStoryWriting("videoUrl", e.target.value || "");
  };

  const handlePictureUpload = async (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}의 크기가 10MB를 초과합니다.`);
        return false;
      }
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        alert(`${file.name}은 JPG, JPEG, PNG 파일만 업로드 가능합니다.`);
        return false;
      }
      return true;
    });

    await uploadIntroPictures(validFiles);
  };

  const handleEditImage = (index) => {
    setEditingImageIndex(index);
  };

  const handleImageEdit = async (editedImageBlob) => {
    const imageToEdit = formData.introPictures[editingImageIndex];
    await editIntroPicture(imageToEdit.id, editedImageBlob);
    setEditingImageIndex(null);
  };

  return (
    <div className={styles.introMediaUpload}>
      <label className={styles.label}>
        소개 영상/사진 등록 <span className={styles.required}>*</span>
      </label>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.button} ${
            formData.introType === "video" ? styles.active : ""
          }`}
          onClick={() => updateStoryWriting("introType", "video")}
        >
          소개 영상
        </button>
        <button
          type="button"
          className={`${styles.button} ${
            formData.introType === "pictures" ? styles.active : ""
          }`}
          onClick={() => updateStoryWriting("introType", "pictures")}
        >
          소개 사진
        </button>
      </div>

      {formData.introType === "video" ? (
        <div className={styles.videoInput}>
          <input
            type="text"
            placeholder="영상 URL 입력"
            value={formData.videoUrl || ""}
            onChange={handleVideoUrlChange}
            className={styles.input}
          />
          <p className={styles.helpText}>
            유튜브, 비메오 등 영상 스트리밍 서비스 URL 등록 가능
          </p>
        </div>
      ) : (
        <div className={styles.pictureUpload}>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            multiple
            ref={pictureInputRef}
            onChange={handlePictureUpload}
            className={styles.fileInput}
          />
          <button
            type="button"
            onClick={() => pictureInputRef.current.click()}
            className={styles.uploadButton}
          >
            사진 선택 ({formData.introPictures?.length || 0}/10)
          </button>
          <div className={styles.thumbnailContainer}>
            {formData.introPictures?.map((pic, index) => (
              <div key={pic.id} className={styles.thumbnail}>
                <img
                  src={pic.url}
                  alt={`Intro ${index + 1}`}
                  className={styles.thumbnailImage}
                />
                <button
                  type="button"
                  onClick={() => removeIntroPicture(pic.id)}
                  className={styles.removeButton}
                >
                  ×
                </button>
                <button
                  type="button"
                  onClick={() => handleEditImage(index)}
                  className={styles.editButton}
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}
          </div>
          <p className={styles.helpText}>
            JPG, JPEG, PNG 10MB 이하, 해상도 760x480 픽셀 이상 ~ 1440x864 픽셀
            이하
          </p>
        </div>
      )}

      {editingImageIndex !== null && (
        <ImageEditor
          image={formData.introPictures[editingImageIndex].url}
          onImageEdit={handleImageEdit}
          onClose={() => setEditingImageIndex(null)}
          isInitialCrop={false}
        />
      )}
    </div>
  );
};

export default IntroMediaUpload;
