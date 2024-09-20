import styles from "./ShareModal.module.css";
import { useToast } from "@/components/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { X, Link, MessageCircle, Facebook, Twitter } from "lucide-react";
import React from "react";

const ShareModal = ({ isOpen, onClose, url, title, summary }) => {
  const { toast } = useToast();

  if (!isOpen) return null;

  const shareToFacebook = () => {
    window.open(
      `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    const text = `${title} ${url}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const shareToKakao = () => {
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: title,
          description: summary,
          imageUrl: "https://example.com/product-image.jpg",
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });
    } else {
      toast({
        title: "오류",
        description: "카카오톡 공유 기능을 사용할 수 없습니다.",
        variant: "destructive",
      });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: "링크 복사 완료",
          description: "클립보드에 링크가 복사되었습니다.",
        });
      },
      (err) => {
        toast({
          title: "링크 복사 실패",
          description: "링크 복사 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    );
  };

  const shareOptions = [
    { name: "링크 복사", icon: Link, action: copyLink, color: "#E0E0E0" },
    {
      name: "카카오",
      icon: MessageCircle,
      action: shareToKakao,
      color: "#FEE500",
    },
    {
      name: "페이스북",
      icon: Facebook,
      action: shareToFacebook,
      color: "#1877F2",
    },
    { name: "X", icon: Twitter, action: shareToTwitter, color: "#000000" },
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>공유</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.shareOptionsGrid}>
          {shareOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className={styles.shareOption}
            >
              <div
                className={styles.shareIconContainer}
                style={{ backgroundColor: option.color }}
              >
                <option.icon
                  size={24}
                  color={option.name === "카카오" ? "#000000" : "#FFFFFF"}
                />
              </div>
              <span className={styles.shareOptionName}>{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
