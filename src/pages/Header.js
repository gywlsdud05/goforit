// src/pages/header.js
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Search, Menu, X, User } from 'react-feather';
import { useNavigate } from "react-router-dom";
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../supabase.client';
import SearchPopover from '../components/SearchPopover';

const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const Header = () => {
    const { user, logout } = useAuthStore((state) => ({
        user: state.user,
        logout: state.logout
    }));


    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const handleResize = useCallback(debounce(() => {
        setIsMobile(window.innerWidth < 768);
    }, 150), []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    useEffect(() => {
        //console.log('User in Header:', user);

        const fetchAvatarUrl = async (userId) => {
            console.log("Attempting to fetch avatar URL. User:", user);
            if (user && userId) {
                console.log("User ID:", userId);

                try {
                    const { data, error } = await supabase
                        .from('users')
                        .select('avatarUrl')
                        .eq('user_id', userId)
                        .single();



                    if (error) {
                        throw error;
                    }

                    if (data) {
                        console.log('Fetched user data:', data);
                    } else {
                        console.log('No data returned from query');
                    }
                } catch (error) {
                    console.error('Error fetching avatar URL:', error.message);
                }
            }
        };
        if (user) {
            fetchAvatarUrl();
        }
    }, [user]);

    const navigateToLoginPage = useCallback(() => {
        navigate("/LoginPage");
    }, [navigate]);

    const navigateToSignUpPage = useCallback(() => {
        navigate("/SignUpPage");
    }, [navigate]);

    const navigateToUserfilePage = useCallback(() => {
        navigate("/UserProfile");
    }, [navigate]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const renderAuthButtons = () => {
        if (user) {
            return (
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                    cursor: 'pointer',
                }}>
                    {user.avatarUrl ? (
                        <img
                            onClick={navigateToUserfilePage}
                            src={user.avatarUrl}
                            alt="Profile"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <User size={24} color="#00c4c4" />
                    )}
                </div>
            );
        } else {
            return (
                <div className="auth-buttons" style={{
                    display: 'flex',
                    gap: '10px'
                }}>
                    <button onClick={navigateToLoginPage} style={buttonStyle}>로그인</button>
                    <button onClick={navigateToSignUpPage} style={{ ...buttonStyle, backgroundColor: '#00c4c4', color: 'white' }}>회원가입</button>
                </div>
            );
        }
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            transition: 'all 0.3s ease-in-out'
        }}>
            <div className="logo" style={{
                fontWeight: 'bold',
                fontSize: '24px',
                color: '#00c4c4',
                transition: 'color 0.3s ease'
            }}>wadiz</div>

            {isMobile ? (
                <button
                    onClick={toggleMenu}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease'
                    }}
                    aria-expanded={isMenuOpen}
                    aria-label="메뉴 열기/닫기"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            ) : (
                <>
                    <nav style={{
                        display: 'flex',
                        gap: '20px'
                    }}>
                        {['오픈예정', '펀딩+', '프리오더', '스토어', '더보기'].map((item, index) => (
                            <a key={index} href="#" style={{
                                ...linkStyle,
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'color 0.3s ease'
                            }}>
                                {item}
                                {item === '더보기' && <ChevronDown size={16} style={{ marginLeft: '4px' }} />}
                            </a>
                        ))}
                    </nav>

                    <div style={{ width: '300px', marginLeft: '20px' }}>
                        <SearchPopover />
                    </div>

                    {renderAuthButtons()}
                </>
            )}

            {isMobile && (
                <div style={{
                    width: '100%',
                    marginTop: '20px',
                    maxHeight: isMenuOpen ? '1000px' : '0',
                    opacity: isMenuOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.5s ease-in-out',
                }}>
                    <nav style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        marginBottom: '20px'
                    }}>
                        {['오픈예정', '펀딩+', '프리오더', '스토어', '더보기'].map((item, index) => (
                            <a key={index} href="#" style={{
                                ...linkStyle,
                                opacity: isMenuOpen ? 1 : 0,
                                transform: `translateY(${isMenuOpen ? '0' : '-10px'})`,
                                transition: `all 0.3s ease ${index * 0.1}s`
                            }}>
                                {item}
                                {item === '더보기' && <ChevronDown size={16} style={{ marginLeft: '4px' }} />}
                            </a>
                        ))}
                    </nav>

                    <div style={{ marginBottom: '20px', opacity: isMenuOpen ? 1 : 0, transform: `translateY(${isMenuOpen ? '0' : '-10px'})`, transition: 'all 0.3s ease 0.3s' }}>
                        <SearchPopover />
                    </div>

                    {renderAuthButtons()}

                </div>
            )}
        </header>
    );
};

const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    fontWeight: '500',
    ':hover': {
        color: '#00c4c4'
    }
};

const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#f5f5f5',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '500',
    ':hover': {
        backgroundColor: '#e0e0e0'
    }
};

export default Header;