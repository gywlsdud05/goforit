import React from 'react';
import styles from './SkeletonProduct.module.css';

const SkeletonProduct = () => {
  return (
    <div className={styles.skeletonProduct}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonStats}>
          <div className={styles.skeletonPercentage}></div>
          <div className={styles.skeletonRemaining}></div>
        </div>
        <div className={styles.skeletonBackers}></div>
      </div>
    </div>
  );
};

export default SkeletonProduct;