import styles from "./BellPage.module.css";
import { Bell, Settings } from "lucide-react";
import React from "react";

const NotificationItem = ({ title, content, time, icon }) => (
  <div className={styles.notificationItem}>
    <div className={styles.notificationHeader}>
      <span className={styles.notificationTitle}>{title}</span>
      <span className={styles.notificationTime}>{time}</span>
    </div>
    <p className={styles.notificationContent}>{content}</p>
    {icon && <div className={styles.notificationIcon}>{icon}</div>}
  </div>
);

const BellPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>알림</h1>
        <Settings className={styles.settingsIcon} />
      </div>

      <div className={styles.notificationList}>
        <NotificationItem
          title="팔람/프리덴단 팔람"
          content="4만원대 프리미엄 팔람 스포츠 선글라스 | 눈부심 없이 더 선명한, 볼터 프로젝트의 새소식이 도착했습니다."
          time="4시간 전"
          icon={<Bell className={styles.bellIcon} />}
        />

        <NotificationItem
          title="와디즈 알림"
          content="팔람 프로젝트 종료 D-3, 3,416% 달성! 인기 프로젝트 종료 전 기회를 놓치지 마세요!"
          time="하루 전"
        />

        <NotificationItem
          title="팔람/프리덴단 팔람"
          content="4만원대 프리미엄 팔람 스포츠 선글라스 | 눈부심 없이 더 선명한, 볼터 프로젝트의 새소식이 도착했습니다."
          time="24.08.26"
        />
      </div>
    </div>
  );
};

export default BellPage;
