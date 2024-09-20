import styles from "./ProjectModal.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNewProject = () => {
    navigate("/ProductWritePage");
    onClose();
  };

  const handleContinueProject = () => {
    navigate("/MakingList");
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>작성 중인 프로젝트가 있어요</h2>
        <p>
          이전에 만든 프로젝트를 이어서 만들거나 새로운 프로젝트를 만들 수도
          있어요.
        </p>
        <div className={styles.buttonContainer}>
          <button onClick={handleNewProject} className={styles.primaryButton}>
            프로젝트 새로 만들기
          </button>
          <button
            onClick={handleContinueProject}
            className={styles.secondaryButton}
          >
            이전 프로젝트 이어서 만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
