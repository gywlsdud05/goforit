import styles from "./PaymentSuccess.module.css";
import { CheckCircle } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const { orderDetails } = location.state || {};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className="text-center">
          <CheckCircle className={styles.icon} />
          <h2 className={styles.title}>결제 완료</h2>
          <p className={styles.subtitle}>
            주문이 성공적으로 완료되었습니다. 감사합니다!
          </p>
        </div>

        {orderDetails && (
          <div className={styles.orderDetails}>
            <h3 className={styles.orderDetailsTitle}>주문 상세</h3>
            <dl className={styles.orderDetailsList}>
              <div className={styles.orderDetailsItem}>
                <dt className={styles.orderDetailsLabel}>주문 번호</dt>
                <dd className={styles.orderDetailsValue}>
                  {orderDetails.orderId}
                </dd>
              </div>
              <div className={styles.orderDetailsItem}>
                <dt className={styles.orderDetailsLabel}>상품명</dt>
                <dd className={styles.orderDetailsValue}>
                  {orderDetails.productName}
                </dd>
              </div>
              <div className={styles.orderDetailsItem}>
                <dt className={styles.orderDetailsLabel}>결제 금액</dt>
                <dd className={styles.orderDetailsValue}>
                  {orderDetails.amount.toLocaleString()}원
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div className={styles.infoSection}>
          <h3 className={styles.infoTitle}>안내 사항</h3>
          <p className={styles.infoText}>
            주문하신 상품은 2-3일 내에 발송될 예정입니다. 배송 관련 문의사항은
            고객센터로 연락 주시기 바랍니다.
          </p>
        </div>

        <div>
          <Link to="/" className={styles.button}>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
