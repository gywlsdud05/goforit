import styles from "./PaymentCancellation.module.css";
import { XCircle } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentCancellationPage = () => {
  const location = useLocation();
  const { cancellationDetails } = location.state || {};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className="text-center">
          <XCircle className={styles.icon} />
          <h2 className={styles.title}>결제 취소</h2>
          <p className={styles.subtitle}>
            결제가 취소되었습니다. 다시 시도하시겠습니까?
          </p>
        </div>

        {cancellationDetails && (
          <div className={styles.cancellationDetails}>
            <h3 className={styles.cancellationDetailsTitle}>취소 상세</h3>
            <dl className={styles.cancellationDetailsList}>
              <div className={styles.cancellationDetailsItem}>
                <dt className={styles.cancellationDetailsLabel}>주문 번호</dt>
                <dd className={styles.cancellationDetailsValue}>
                  {cancellationDetails.orderId}
                </dd>
              </div>
              <div className={styles.cancellationDetailsItem}>
                <dt className={styles.cancellationDetailsLabel}>상품명</dt>
                <dd className={styles.cancellationDetailsValue}>
                  {cancellationDetails.productName}
                </dd>
              </div>
              <div className={styles.cancellationDetailsItem}>
                <dt className={styles.cancellationDetailsLabel}>취소 금액</dt>
                <dd className={styles.cancellationDetailsValue}>
                  {cancellationDetails.amount.toLocaleString()}원
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div className={styles.infoSection}>
          <h3 className={styles.infoTitle}>안내 사항</h3>
          <p className={styles.infoText}>
            결제가 취소되었습니다. 문제가 발생한 경우 고객센터로 문의해 주시기
            바랍니다. 다시 결제를 진행하시려면 아래 버튼을 클릭해주세요.
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <Link to="/" className={styles.button}>
            홈으로 돌아가기
          </Link>
          <Link
            to="/payment"
            className={`${styles.button} ${styles.primaryButton}`}
          >
            다시 결제하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancellationPage;
