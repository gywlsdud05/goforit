import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import styles from "./MainImageUpload.module.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RotateCw, Crop, Check } from "lucide-react";

const ASPECT_RATIO = 16 / 9;
const CROP_WIDTH = 1200;
const CROP_HEIGHT = 675; // Adjusted to maintain 16:9 ratio
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const MainImageUpload = ({ onImageUpload }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [image, setImage] = useState(null);
  const [rotatedImage, setRotatedImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (image) {
      rotateImage();
    }
  }, [rotation, image]);

  const validateFile = (file) => {
    console.log("Validating file:", file.name, file.size, file.type);
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
    console.log("File selected:", file);
    if (file && validateFile(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          console.log("Image loaded, dimensions:", img.width, "x", img.height);
          if (img.width < CROP_WIDTH || img.height < CROP_HEIGHT) {
            alert(
              `이미지 크기가 ${CROP_WIDTH}x${CROP_HEIGHT} 픽셀 이상이어야 합니다.`
            );
          } else {
            setImage(img);
            setIsModalOpen(true);
            setRotation(0);
            setCrop(undefined);
            setCompletedCrop(null);
            setIsCropping(false);
          }
        };
        img.onerror = (error) => {
          console.error("Error loading image:", error);
        };
        img.src = reader.result;
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const rotateImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = image.width;
    const height = image.height;

    canvas.width = rotation % 180 === 0 ? width : height;
    canvas.height = rotation % 180 === 0 ? height : width;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);

    const rotatedImageUrl = canvas.toDataURL("image/jpeg");
    setRotatedImage(rotatedImageUrl);
  };

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        "cropped.jpg"
      );
      setCroppedImageUrl(croppedImageUrl);
      onImageUpload(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = CROP_WIDTH;
    canvas.height = CROP_HEIGHT;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      CROP_WIDTH,
      CROP_HEIGHT
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const handleCropClick = () => {
    if (isCropping) {
      // Save the current crop
      if (completedCrop) {
        makeClientCrop(completedCrop);
      }
      setIsCropping(false);
    } else {
      // Enter crop mode
      setIsCropping(true);
      setCrop({
        unit: "%",
        width: 100,
        aspect: ASPECT_RATIO,
      });
    }
  };

  const handleConfirm = () => {
    if (completedCrop) {
      makeClientCrop(completedCrop);
    }
    setIsModalOpen(false);
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
        onClick={() => fileInputRef.current.click()}
        className={styles.imageUploadContainer}
      >
        {croppedImageUrl ? (
          <img
            src={croppedImageUrl}
            alt="Cropped"
            className={styles.imagePreview}
          />
        ) : (
          <span className={styles.uploadPlaceholder}>이미지 업로드 (클릭)</span>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={styles.dialogContent}>
          <DialogTitle>이미지 편집</DialogTitle>
          <DialogDescription>
            이미지를 회전하고 16:9 비율로 자를 수 있습니다. 크롭 버튼을 눌러
            크롭 모드를 켜고 끌 수 있습니다.
          </DialogDescription>
          {rotatedImage && (
            <div className={styles.imageEditContainer}>
              <ReactCrop
                src={rotatedImage}
                crop={crop}
                onChange={handleCropChange}
                onComplete={handleCropComplete}
                onImageLoaded={(img) => {
                  imageRef.current = img;
                  return false;
                }}
                aspect={isCropping ? ASPECT_RATIO : undefined}
                disabled={!isCropping}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          )}
          {!rotatedImage && <p>이미지를 불러오는 중 문제가 발생했습니다.</p>}
          <DialogFooter className={styles.dialogFooter}>
            <Button onClick={handleRotate} className={styles.editButton}>
              <RotateCw size={20} />
              회전
            </Button>
            <Button onClick={handleCropClick} className={styles.editButton}>
              <Crop size={20} />
              {isCropping ? "크롭 적용" : "크롭"}
            </Button>
            <Button onClick={handleConfirm} className={styles.confirmButton}>
              <Check size={20} />
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainImageUpload;
