import useDuckFundingAuthStore from "../store/useDuckFundingAuthStore";
import styles from "./UserProfile.module.css";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Camera,
  Edit2,
  ChevronRight,
  Star,
  Users,
  TrendingUp,
  Mail,
  LayoutGrid,
  MessageSquare,
  Megaphone,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { User } from "react-feather";
import { useNavigate } from "react-router-dom";

const MenuItem = ({ icon, text }) => (
  <button className={styles.menuItem}>
    <div className={styles.menuItemContent}>
      {icon}
      <span className={styles.menuItemText}>{text}</span>
    </div>
    <ChevronRight size={20} />
  </button>
);

const UserProfile = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { logout } = useDuckFundingAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));

  console.log("Current user:", user);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProfileData(user.id);
    } else {
      console.log("User not available or user ID is undefined");
      setLoading(false);
    }
  }, [user]);

  const fetchProfileData = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("nickname, avatarUrl, point, coupon")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      console.log("Fetched profile data:", data);
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout, navigate]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <button className={`${styles.button} ${styles.supporterButton}`}>
          서포터
        </button>
        <button className={`${styles.button} ${styles.makerButton}`}>
          메이커
        </button>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.avatarContainer}>
          <img
            src={profileData?.avatarUrl || "http://via.placeholder.com/100x100"}
            alt="Profile"
            className={styles.avatar}
          />
          <button className={styles.cameraButton}>
            <Camera size={16} />
          </button>
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>
            {profileData?.nickname || "익명의 서포터"}
          </h2>
          <button className={styles.editProfileButton}>
            <Edit2 size={16} className="mr-1" /> 프로필 수정
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>포인트</span>
            <span className={styles.statValue}>
              {profileData?.point || "not found"} P
            </span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>쿠폰</span>
            <span className={styles.statValue}>
              {profileData?.coupon || "not found"} 장
            </span>
          </div>
        </div>
      </div>

      <div className={styles.emailSection}>
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>이메일</span>
          <span>{user?.email}</span>
        </div>
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        <LogOut size={20} className="mr-2" />
        로그아웃
      </button>

      <div className={styles.card}>
        <div className={styles.cardItem}>
          <span>펀딩/프리오더</span>
          <div className="flex items-center">
            <span className="mr-2">0</span>
            <ChevronRight size={20} />
          </div>
        </div>
        <div className={styles.cardItem}>
          <span>스토어</span>
          <div className="flex items-center">
            <span className="mr-2">0</span>
            <ChevronRight size={20} />
          </div>
        </div>
      </div>

      <div className={styles.promotionSection}>
        <button className={styles.promotionButton}>
          <div className="flex items-center">
            <img src="/api/placeholder/24/24" alt="Icon" className="mr-2" />
            <span>첫 달 0원으로 배송비 걱정 끝 무료배송 시금</span>
          </div>
          <ChevronRight size={20} />
        </button>
        <button className={styles.promotionButton}>
          <div className="flex items-center">
            <img src="/api/placeholder/24/24" alt="Icon" className="mr-2" />
            <span>자시서명으로 최대 50,000P 받는 방법</span>
          </div>
          <ChevronRight size={20} />
        </button>
        <button className={styles.promotionButton}>
          <div className="flex items-center">
            <img src="/api/placeholder/24/24" alt="Icon" className="mr-2" />
            <span>굿즈로 펀 모으기해 보실래요?</span>
          </div>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.menuSection}>
        <div>
          <MenuItem icon={<Star size={20} />} text="최근 본" />
          <MenuItem icon={<Users size={20} />} text="팔로잉" />
          <MenuItem icon={<TrendingUp size={20} />} text="투자 관리" />
        </div>

        <div className={styles.sectionDivider}>
          <h3 className={styles.sectionTitle}>나의 문의 내역</h3>
          <MenuItem icon={<Mail size={20} />} text="메이커 문의" />
          <MenuItem icon={<LayoutGrid size={20} />} text="스타트업 문의" />
        </div>

        <div className={styles.sectionDivider}>
          <h3 className={styles.sectionTitle}>고객센터</h3>
          <MenuItem icon={<MessageSquare size={20} />} text="1:1 채팅 상담" />
          <MenuItem icon={<Megaphone size={20} />} text="공지사항" />
          <MenuItem icon={<MessageSquare size={20} />} text="도움말 센터" />
          <MenuItem icon={<UserPlus size={20} />} text="친구 초대하기" />
          <MenuItem icon={<Settings size={20} />} text="설정" />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
