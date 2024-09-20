import styles from "./WorldPage.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Block = ({ image, title, description, link }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.block}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} />
      </div>
      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <Link to={link}>
            <h2>{title}</h2>
          </Link>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {isOpen && (
          <div className={styles.description}>
            <p>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const WorldPage = () => {
  return (
    <div className={styles.worldPage}>
      <h1 className={styles.welcome}>DuckWorld에 오신 것을 환영합니다</h1>
      <div className={styles.blocksContainer}>
        <Block
          image="http://via.placeholder.com/300x200"
          title="DuckFunding"
          description="여러분이 원하는 창작자에게 펀딩해보세요!!"
          link="/DuckFundingHome"
        />
        <Block
          image="http://via.placeholder.com/300x200"
          title="DuckChat"
          description="DuckChat으로 실시간 소통을, 무료 이모티콘을 즐겨보세요!"
          link="/DuckChatHome"
        />
        <Block
          image="http://via.placeholder.com/300x200"
          title="세 번째 블록 제목"
          description="세 번째 블록 설명"
          link="/" // 세 번째 블록의 링크는 임시로 홈으로 설정
        />
      </div>
    </div>
  );
};

export default WorldPage;
