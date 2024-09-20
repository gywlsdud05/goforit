import useDuckChatAuthStore from "../store/useDuckChatAuthStore";
import styles from "./DuckChatHome.module.css";
import LoginModal from "./LoginModal";
import { Menu, MessageSquare, Smile, Send, LogIn } from "lucide-react";
import React, { useState, useEffect } from "react";

const DuckChatHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const chatRooms = [
    { id: 1, name: "일반 채팅" },
    { id: 2, name: "게임 채팅" },
    { id: 3, name: "음악 채팅" },
  ];

  useEffect(() => {
    const initializeAuth = async () => {
      const session = await useDuckChatAuthStore.getSession();
      if (session && session.user) {
        const userProfile = await useDuckChatAuthStore.fetchUserProfile(
          session.user.id
        );
        setUser({ ...session.user, ...userProfile });
      }
    };

    initializeAuth();

    const { data: authListener } = useDuckChatAuthStore.onAuthStateChange(
      ({ event, session, userProfile }) => {
        if (event === "SIGNED_IN" && session) {
          setUser({ ...session.user, ...userProfile });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleSocialLogin = async (provider) => {
    try {
      await useDuckChatAuthStore.signInWithSocial(provider);
      setShowLoginModal(false);
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };

  const handleEmailPasswordLogin = async (email, password) => {
    try {
      await useDuckChatAuthStore.signIn(email, password);
      setShowLoginModal(false);
    } catch (error) {
      console.error("Email/Password login error:", error);
      // 여기에 에러 처리 로직을 추가할 수 있습니다 (예: 사용자에게 에러 메시지 표시)
    }
  };

  const handleLogout = async () => {
    try {
      await useDuckChatAuthStore.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={styles.chatHome}>
      <header className={styles.header}>
        <button onClick={toggleSidebar} className={styles.menuButton}>
          <Menu />
        </button>
        {user ? (
          <div className={styles.userInfo}>
            <img
              src={user.avatarUrl}
              alt="User Avatar"
              className={styles.avatar}
            />
            <span className={styles.nickname}>{user.nickname}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              로그아웃
            </button>
          </div>
        ) : (
          <button onClick={handleLoginClick} className={styles.loginButton}>
            <LogIn />
            로그인
          </button>
        )}
        <button className={styles.emojiButton}>
          <Smile />
          이모티콘 만들기
        </button>
      </header>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <h2>채팅방 목록</h2>
        <ul>
          {chatRooms.map((room) => (
            <li key={room.id}>{room.name}</li>
          ))}
        </ul>
      </div>

      <main className={styles.chatArea}>{/* 채팅 메시지 영역 */}</main>

      <form onSubmit={handleSendMessage} className={styles.messageInput}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit">
          <Send />
        </button>
      </form>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSocialLogin={handleSocialLogin}
          onEmailPasswordLogin={handleEmailPasswordLogin}
        />
      )}
    </div>
  );
};

export default DuckChatHome;
