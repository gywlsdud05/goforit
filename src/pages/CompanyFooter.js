import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';
import styles from './CompanyFooter.module.css';

const CompanyFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h2 className={styles.title}>와디즈 고객센터</h2>
        
        <div className={styles.gridContainer}>
          <div>
            <p>와디즈(주)</p>
            <p>대표이사 신혜성 | 사업자등록번호 258-87-01370</p>
            <p>통신판매업신고번호 2021-성남분당C-1153</p>
            <p>경기 성남시 분당구 판교로 242 PDC A동 402호</p>
          </div>
          <div>
            <p>이메일 상담 info@wadiz.kr</p>
            <p>유선 상담 1661-9056</p>
            <p>© wadiz Co., Ltd.</p>
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button className={styles.button}>
            채팅 상담하기 <ChevronRight size={20} />
          </button>
          <button className={styles.button}>
            문의 등록하기 <ChevronRight size={20} />
          </button>
          <button className={styles.button}>
            도움말 센터 바로가기 <ChevronRight size={20} />
          </button>
          <button className={styles.button}>
            Contact for Global <ChevronRight size={20} />
          </button>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>상담 가능 시간</h3>
          <p>평일 오전 9시 ~ 오후 6시 (주말, 공휴일 제외)</p>
        </div>
        
        <div className={styles.smallText}>
          <p>일부 상품의 경우 와디즈는 통신판매중개자이며 통신판매 당사자가 아닙니다.</p>
          <p>해당되는 상품의 경우 상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있으므로, 각 상품 페이지에서 구체적인 내용을 확인하시기 바랍니다.</p>
          <p>와디즈 사이트의 콘텐츠 정보, 상품의 거래 정보, 보상 정보, 유저 리뷰, 타인의 권리 침해 관한 정보로 인한 문제와 관련된 모든 책임과 정보통신망법, 전자상거래법, 소비자보호법, 저작권법 침해등에 관한 문제는 관련 법에 따라 책임을 집니다.</p>
        </div>
        
        <div className={styles.appButtonContainer}>
          <button className={styles.appButton}>
            <span className={styles.appButtonText}>Android앱</span>
          </button>
          <button className={styles.appButton}>
            <span className={styles.appButtonText}>iOS앱</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default CompanyFooter;