import useDuckFundingAuthStore from "../store/useDuckFundingAuthStore";
import { supabase } from "../supabase.client";
import styles from "./MakingList.module.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MakingList = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useDuckFundingAuthStore();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    const fetchPendingProjects = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("maker_id", user.user_id)
          .eq("status", "pending");

        if (error) {
          console.error("Error fetching pending projects:", error);
        } else {
          setProjects(data);
        }
      }
    };

    fetchPendingProjects();
  }, [user]);

  const handleProjectClick = (projectId) => {
    navigate(`/ProductWritePage/${projectId}`);
  };

  const handleOptionsClick = (e, project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", projectToDelete.id);

      if (error) {
        console.error("Error deleting project:", error);
      } else {
        setProjects(projects.filter((p) => p.id !== projectToDelete.id));
      }
    }
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>만드는 프로젝트</h1>
      <div className={styles.tabContainer}>
        <button className={styles.tabActive}>전체</button>
        <button className={styles.tab}>투자</button>
        <button className={styles.tab}>펀딩 · 프리오더</button>
      </div>
      <div className={styles.projectList}>
        {projects.map((project) => (
          <div
            key={project.id}
            className={styles.projectCard}
            onClick={() => handleProjectClick(project.id)}
          >
            <div className={styles.projectImage}>
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} />
              ) : (
                <div className={styles.placeholderImage}>
                  대표이미지 등록 필요
                </div>
              )}
            </div>
            <div className={styles.projectInfo}>
              <h2 className={styles.projectTitle}>
                {project.title || "제목을 입력해주세요."}
              </h2>
              <p className={styles.projectStatus}>작성 중</p>
            </div>
            <button className={styles.continueButton}>스튜디오 바로가기</button>
            <button
              className={styles.optionsButton}
              onClick={(e) => handleOptionsClick(e, project)}
            >
              ⋮
            </button>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p className={styles.modalText}>
              작성중인 프로젝트를 삭제하시겠습니까?
            </p>
            <p className={styles.modalSubText}>
              프로젝트를 삭제하시면,
              <br />
              작성된 모든 내용이 삭제됩니다.
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleDeleteConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakingList;
