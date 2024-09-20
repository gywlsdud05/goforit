import ImageEditor from "./ImageEditor";
import styles from "./MainImageUpload.module.css";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const ASPECT_RATIO = 16 / 9;
const CROP_WIDTH = 1200;
const CROP_HEIGHT = 675;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const MainImageUpload = ({ onImageUpload }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isInitialCrop, setIsInitialCrop] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      alert("파일 크기는 10MB를 초과할 수 없습니다.");
      return false;
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      alert("JPG, JPEG, PNG 파일만 업로드 가능합니다.");
      return false;
    }
    return true;
  };

  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < CROP_WIDTH || img.height < CROP_HEIGHT) {
          alert(
            `이미지 크기가 ${CROP_WIDTH}x${CROP_HEIGHT} 픽셀 이상이어야 합니다.`
          );
        } else {
          setImageFile(file);
          setIsInitialCrop(true);
          setIsEditorOpen(true);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleImageEdit = (editedImageBlob) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const newPreviewUrl = URL.createObjectURL(editedImageBlob);
    setPreviewUrl(newPreviewUrl);
    onImageUpload(editedImageBlob);
    setIsEditorOpen(false);
    setIsInitialCrop(false);
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setImageFile(null);
    setIsEditorOpen(false);
    setIsInitialCrop(false);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.mainImageUpload}>
      <div className={styles.imageUploadGuide}>
        <h3 className={styles.guideTitle}>대표 이미지 등록 가이드</h3>
        <ul className={styles.guideList}>
          <li>10MB 이하의 JPG, JPEG, PNG 파일</li>
          <li>해상도 1200x675 픽셀 이상 (16:9 비율)</li>
          <li>사진을 선택하면 회전 및 16:9 비율로 자르기가 가능합니다.</li>
        </ul>
      </div>
      <input
        type="file"
        id="mainImage"
        accept="image/jpeg,image/jpg,image/png"
        ref={fileInputRef}
        onChange={handleMainImageUpload}
        className={styles.fileInput}
      />
      <div
        onClick={() => !previewUrl && fileInputRef.current.click()}
        className={styles.imageUploadContainer}
      >
        {previewUrl ? (
          <div className={styles.imageWrapper}>
            <img
              src={previewUrl}
              alt="Uploaded"
              className={styles.uploadedImage}
            />
            <div className={styles.imageOverlay}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditorOpen(true);
                }}
                className={styles.editButton}
              >
                <Pencil size={16} />
                편집
              </Button>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className={styles.removeButton}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <span className={styles.uploadPlaceholder}>이미지 업로드 (클릭)</span>
        )}
      </div>

      {isEditorOpen && imageFile && (
        <ImageEditor
          image={imageFile}
          onImageEdit={handleImageEdit}
          onClose={() => setIsEditorOpen(false)}
          isInitialCrop={isInitialCrop}
        />
      )}
    </div>
  );
};

export default MainImageUpload;
