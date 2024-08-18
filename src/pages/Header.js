import React from 'react';
import { ChevronDown, Search } from 'react-feather'; // 필요한 아이콘을 react-feather에서 가져옵니다.
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const navigateToLoginPage = () => {
        // 로그인 페이지로 네비게이트 하는 로직을 여기에 작성합니다.
        
            navigate("/LoginPage");
          
        console.log('Navigating to Login Page');
    };

  
    const navigateToSignUpPage = () => {
        // 회원가입 페이지로 네비게이트 하는 로직을 여기에 작성합니다.
        navigate("/SignUpPage");
        console.log('Navigating to Sign Up Page');
    };

    return (
        <header className="header">
            <div className="logo">wadiz</div>
            <nav>
                <a href="#">오픈예정</a>
                <a href="#">펀딩+</a>
                <a href="#">프리오더</a>
                <a href="#">스토어</a>
                <a href="#">더보기 <ChevronDown size={16} /></a>
            </nav>
            <div className="search-bar">
                <input type="text" placeholder="새로운 일상이 필요하신가요?" />
                <Search size={20} />
            </div>
            <div className="auth-buttons">
                <button onClick={navigateToLoginPage}>로그인</button>
                <button className="signup" onClick={navigateToSignUpPage}>회원가입</button>
            </div>
        </header>
    );
};

export default Header;
