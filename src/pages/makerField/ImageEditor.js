import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import styles from "./ImageEditor.module.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RotateCw, Crop as CropIcon, Check } from "lucide-react";

const ASPECT_RATIO = 16 / 9;

const ImageEditor = ({ image, onImageEdit, onClose, isInitialCrop }) => {
  const [crop, setCrop] = useState({
    unit: "%",
    width: 100,
    aspect: ASPECT_RATIO,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(true);
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [croppedImgSrc, setCroppedImgSrc] = useState(null);

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    const loadImage = async () => {
      let src;
      if (image instanceof Blob) {
        src = URL.createObjectURL(image);
      } else if (typeof image === "string") {
        src = image;
      }
      setImgSrc(src);
    };

    loadImage();

    return () => {
      if (imgSrc && imgSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imgSrc);
      }
      if (croppedImgSrc && croppedImgSrc.startsWith("blob:")) {
        URL.revokeObjectURL(croppedImgSrc);
      }
    };
  }, [image]);

  const rotateImage = useCallback(async () => {
    if (!imgRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = imgRef.current;

    const rotRad = (rotation * Math.PI) / 180;
    const width = image.width;
    const height = image.height;

    canvas.width =
      Math.abs(width * Math.cos(rotRad)) + Math.abs(height * Math.sin(rotRad));
    canvas.height =
      Math.abs(width * Math.sin(rotRad)) + Math.abs(height * Math.cos(rotRad));

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotRad);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const rotatedImageUrl = URL.createObjectURL(blob);
          setImgSrc(rotatedImageUrl);
          resolve(rotatedImageUrl);
        }
      }, "image/jpeg");
    });
  }, [rotation]);

  useEffect(() => {
    rotateImage();
  }, [rotation, rotateImage]);

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return null;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * scaleX * pixelRatio;
    canvas.height = completedCrop.height * scaleY * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  }, [completedCrop]);

  const handleCropComplete = async (crop, percentCrop) => {
    setCompletedCrop(percentCrop);
    const croppedImageBlob = await getCroppedImg();
    if (croppedImageBlob) {
      if (croppedImgSrc) {
        URL.revokeObjectURL(croppedImgSrc);
      }
      const newCroppedImgSrc = URL.createObjectURL(croppedImageBlob);
      setCroppedImgSrc(newCroppedImgSrc);
    }
  };

  const handleRotate = async () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    await rotateImage();
    // Reset crop after rotation
    setCrop({
      unit: "%",
      width: 100,
      aspect: ASPECT_RATIO,
    });
  };

  const handleCropClick = () => {
    setIsCropping((prev) => !prev);
    if (!isCropping) {
      setCrop({
        unit: "%",
        width: 100,
        aspect: ASPECT_RATIO,
      });
    }
  };

  const handleConfirm = async () => {
    const finalImage = croppedImgSrc || imgSrc;
    if (finalImage) {
      const response = await fetch(finalImage);
      const blob = await response.blob();
      onImageEdit(blob);
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogTitle>이미지 편집</DialogTitle>
        <DialogDescription>
          {isInitialCrop
            ? "이미지를 16:9 비율로 자르세요."
            : "이미지를 회전하고 16:9 비율로 자를 수 있습니다. 크롭 버튼을 눌러 크롭 모드를 켜고 끌 수 있습니다."}
        </DialogDescription>
        <div className={styles.imageEditContainer}>
          {imgSrc && (
            <ReactCrop
              src={imgSrc}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={handleCropComplete}
              aspect={ASPECT_RATIO}
              disabled={!isCropping}
              onImageLoaded={onImageLoad}
            />
          )}
        </div>
        <DialogFooter className={styles.dialogFooter}>
          {!isInitialCrop && (
            <>
              <Button onClick={handleRotate} className={styles.editButton}>
                <RotateCw size={20} />
                회전
              </Button>
              <Button onClick={handleCropClick} className={styles.editButton}>
                <CropIcon size={20} />
                {isCropping ? "크롭 해제" : "크롭"}
              </Button>
            </>
          )}
          <Button
            onClick={handleConfirm}
            className={`${styles.editButton} ${styles.confirmButton}`}
          >
            <Check size={20} />
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
