import React from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {Routes, Route, Link} from "react-router-dom";

const Block = ({ image, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block">
      <div className="image-container">
        <img src={image} alt={title} />
      </div>
      <div className="content">
        <div className="title-container">
        <Link to="/DuckFundingHome"><h2>{title}</h2></Link>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {isOpen && (
          <div className="description">
            <p>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const WorldPage = () =>{
  return (
      

    <div className="world-page">
      <h1 className="welcome">DuckWorld에 오신 것을 환영합니다</h1>
      <div className="blocks-container">
        <Block 
          image ="http://via.placeholder.com/300x200" alt="DuckFunding 이미지" 
          title="DuckFunding"
          description="여러분이 원하는 창작자에게 펀딩해보세요!!"
        />
        <div className="block">
          <img src="http://via.placeholder.com/300x200" alt="두 번째 블록 이미지" />
          <Link to="/example"><h2>두 번째 블록 제목</h2></Link>
          <p>두 번째 블록 설명</p>
        </div>
        <div className="block">
          <img src="http://via.placeholder.com/300x200" alt="세 번째 블록 이미지" />
          <h2>세 번째 블록 제목</h2>
          <p>세 번째 블록 설명</p>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');
        
        .world-page {
          font-family: 'Noto Sans KR', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f0f0;
          padding: 20px;
        }
        .welcome {
          font-size: 2.5em;
          margin-top: 50px;
          text-align: center;
          color: #333;
        }
        .blocks-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 1200px;
          margin: 50px auto;
        }
        .block {
          width: 300px;
          margin: 20px;
          background-color: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        .image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .image-container::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50px;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
        }
        .block img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .content {
          padding: 15px;
        }
        .title-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .title-container h2 {
          font-size: 1.5em;
          margin: 0;
          color: #333;
        }
        .title-container button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }
        .description {
          background-color: #e0e0e0;
          border-radius: 10px;
          padding: 10px;
          margin-top: 10px;
        }
        .description p {
          font-size: 1em;
          color: #444;
          margin: 0;
        }
      `}</style>
    </div> 
  ); 
};


export default WorldPage;