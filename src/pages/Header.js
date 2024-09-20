import SearchPopover from "../components/SearchPopover";
import useDuckFundingAuthStore from "../store/useDuckFundingAuthStore";
import { supabase } from "../supabase.client";
import styles from "./Header.module.css";
import ProjectModal from "./ProjectModal";
import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown, Search, Menu, X, User, Bell, Heart } from "react-feather";
import { useNavigate } from "react-router-dom";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Header = () => {
  const { user, logout } = useDuckFundingAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = useCallback(
    debounce(() => {
      setIsMobile(window.innerWidth < 768);
    }, 150),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      console.log("Attempting to fetch avatar URL. User:", user);
      if (user) {
        console.log("User ID:", user.user_id);

        try {
          const { data, error } = await supabase
            .from("users")
            .select("avatarUrl")
            .eq("user_id", user.user_id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            console.log("Fetched user data:", data);
          } else {
            console.log("No data returned from query");
          }
        } catch (error) {
          console.error("Error fetching avatar URL:", error.message);
        }
      }
    };
    if (user) {
      fetchAvatarUrl();
    }
  }, [user]);

  const navigateToFundingHomePage = useCallback(() => {
    navigate("/DuckFundingHome");
  }, [navigate]);

  const navigateToLoginPage = useCallback(() => {
    navigate("/LoginPage");
  }, [navigate]);

  const navigateToSignUpPage = useCallback(() => {
    navigate("/SignUpPage");
  }, [navigate]);

  const navigateToUserfilePage = useCallback(() => {
    navigate("/UserProfile");
  }, [navigate]);

  const navigateToFavorites = useCallback(() => {
    navigate("/Favorites");
  }, [navigate]);

  const navigateToBellPage = useCallback(() => {
    navigate("/BellPage");
  }, [navigate]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const renderIcons = () => {
    return (
      <div className={styles.iconContainer}>
        <div className={styles.iconWrapper}>
          <Bell
            size={24}
            className={styles.icon}
            onClick={navigateToBellPage}
          />
          <span className={styles.notificationBadge}>2</span>
        </div>
        <Heart
          size={24}
          className={styles.icon}
          onClick={navigateToFavorites}
        />
      </div>
    );
  };

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className={styles.userSection}>
          {renderIcons()}
          <div className={styles.avatarContainer}>
            {user.avatarUrl ? (
              <img
                onClick={navigateToUserfilePage}
                src={user.avatarUrl}
                alt="Profile"
                className={styles.avatarImage}
              />
            ) : (
              <User size={24} color="#00c4c4" />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.authButtons}>
          <button onClick={navigateToLoginPage} className={styles.button}>
            로그인
          </button>
          <button
            onClick={navigateToSignUpPage}
            className={`${styles.button} ${styles.signUpButton}`}
          >
            회원가입
          </button>
        </div>
      );
    }
  };

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [hasExistingProjects, setHasExistingProjects] = useState(false);

  useEffect(() => {
    const checkExistingProjects = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("products")
          .select("id")
          .eq("maker_id", user.user_id)
          .eq("status", "pending")
          .limit(1);

        if (error) {
          console.error("Error checking existing projects:", error);
        } else {
          setHasExistingProjects(data.length > 0);
        }
      }
    };

    checkExistingProjects();
  }, [user]);

  const handleCreateProject = () => {
    if (hasExistingProjects) {
      setShowProjectModal(true);
    } else {
      navigate("/ProductWritePage");
    }
  };

  const renderCreateProjectButton = () => (
    <button
      onClick={handleCreateProject}
      className={`${styles.button} ${styles.createProjectButton}`}
    >
      프로젝트 만들기
    </button>
  );

  return (
    <header
      className={styles.header}
      style={{ flexWrap: isMobile ? "wrap" : "nowrap" }}
    >
      <div
        className={styles.logo}
        onClick={navigateToFundingHomePage}
        style={{ cursor: "pointer" }}
      >
        DuckFunding
      </div>

      {isMobile ? (
        <button
          onClick={toggleMenu}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.3s ease",
          }}
          aria-expanded={isMenuOpen}
          aria-label="메뉴 열기/닫기"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      ) : (
        <>
          <nav className={styles.nav}>
            {["오픈예정", "펀딩+", "프리오더", "스토어", "더보기"].map(
              (item, index) => (
                <a key={index} href="#" className={styles.link}>
                  {item}
                  {item === "더보기" && (
                    <ChevronDown size={16} style={{ marginLeft: "4px" }} />
                  )}
                </a>
              )
            )}
          </nav>

          <div className={styles.searchContainer}>
            <SearchPopover />
          </div>

          {renderAuthButtons()}
          {renderCreateProjectButton()}
        </>
      )}

      {isMobile && (
        <div
          className={styles.mobileMenu}
          style={{
            maxHeight: isMenuOpen ? "1000px" : "0",
            opacity: isMenuOpen ? 1 : 0,
          }}
        >
          <nav className={styles.mobileNav}>
            {["오픈예정", "펀딩+", "프리오더", "스토어", "더보기"].map(
              (item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`${styles.link} ${styles.mobileLink}`}
                  style={{
                    opacity: isMenuOpen ? 1 : 0,
                    transform: `translateY(${isMenuOpen ? "0" : "-10px"})`,
                    transitionDelay: `${index * 0.1}s`,
                  }}
                >
                  {item}
                  {item === "더보기" && (
                    <ChevronDown size={16} style={{ marginLeft: "4px" }} />
                  )}
                </a>
              )
            )}
          </nav>

          <div
            className={styles.mobileSearchContainer}
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: `translateY(${isMenuOpen ? "0" : "-10px"})`,
            }}
          >
            <SearchPopover />
          </div>

          {renderAuthButtons()}

          <div
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: `translateY(${isMenuOpen ? "0" : "-10px"})`,
            }}
          >
            {renderCreateProjectButton()}
          </div>
        </div>
      )}

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onConfirm={() => {
          setShowProjectModal(false);
          navigate("/ProductWritePage");
        }}
      />
    </header>
  );
};

export default Header;
