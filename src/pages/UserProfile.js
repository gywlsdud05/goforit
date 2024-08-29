import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Camera, Edit2, ChevronRight, Star, Users, TrendingUp, Mail, LayoutGrid, MessageSquare, Megaphone, UserPlus, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { User } from 'react-feather';
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabase.client';


const MenuItem = ({ icon, text }) => (
    <button className="w-full py-3 flex justify-between items-center">
        <div className="flex items-center">
            {icon}
            <span className="ml-3">{text}</span>
        </div>
        <ChevronRight size={20} />
    </button>
);
const UserProfile = () => {
    const supabase = useSupabaseClient();
    const user = useUser();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { logout } = useAuthStore((state) => ({
        user: state.user,
        logout: state.logout
    }));

    console.log("Current user:", user);

    const navigate = useNavigate();

    useEffect((userId) => {
        if (user && userId) {
            console.log("Fetching profile data for user ID:", userId);
            fetchProfileData();
        } else {
            console.log("User not available or user ID is undefined");
            setLoading(false);
        }
        if(user){
            fetchProfileData(user.id);
            }
    }, [user]);

    const fetchProfileData = async (userId) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('nickname, avatarUrl, point, coupon')
                .eq('user_id', userId)
                .single();

                if (error) throw error;
                console.log("Fetched profile data:", data);
                setProfileData(data);
              } catch (error) {
                console.error('Error fetching profile data:', error.message);
              } finally {
                setLoading(false);
              }
    };

    //   const handleLogout = async () => {
    //     try {
    //       const { error } = await supabase.auth.signOut();
    //       if (error) throw error;
    //       // 로그아웃 후 리다이렉트 또는 상태 업데이트 로직 추가
    //     } catch (error) {
    //       console.error('Error logging out:', error.message);
    //     }
    //   };

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }, [logout, navigate]);

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex mb-4">
                <button className="bg-teal-500 text-white px-4 py-2 rounded-full mr-2">서포터</button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full">메이커</button>
            </div>

            <div className="flex items-center mb-4">
                <div className="relative">
                    <img src={profileData?.avatarUrl || <User size={100} color="#00c4c4" /> || "http://via.placeholder.com/100x100"}
                        alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                    <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                        <Camera size={16} />
                    </button>
                </div>
                <div className="ml-4">
                    <h2 className="text-xl font-bold">{profileData?.nickname || '익명의 서포터'}</h2>
                    <button className="text-gray-500 flex items-center">
                        <Edit2 size={16} className="mr-1" /> 프로필 수정
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 p-4 rounded">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">포인트</span>
                        <span className="text-xl">{profileData?.point || 'not found'} P</span>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">쿠폰</span>
                        <span className="text-xl">{profileData?.coupon || 'not found'} 장</span>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 p-4 rounded mb-4">
                <div className="flex justify-between items-center">
                    <span className="font-bold">이메일</span>
                    <span>{user?.email}</span>
                </div>
            </div>
            <button onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded-lg flex justify-center items-center"
            >
                <LogOut size={20} className="mr-2" />
                로그아웃
            </button>




            <div className="bg-white shadow rounded-lg mb-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <span>펀딩/프리오더</span>
                    <div className="flex items-center">
                        <span className="mr-2">0</span>
                        <ChevronRight size={20} />
                    </div>
                </div>
                <div className="flex justify-between items-center p-4">
                    <span>스토어</span>
                    <div className="flex items-center">
                        <span className="mr-2">0</span>
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <button className="w-full bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="/api/placeholder/24/24" alt="Icon" className="mr-2" />
                        <span>첫 달 0원으로 배송비 걱정 끝 무료배송 시금</span>
                    </div>
                    <ChevronRight size={20} />
                </button>
                <button className="w-full bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="/api/placeholder/24/24" alt="Icon" className="mr-2" />
                        <span>자시서명으로 최대 50,000P 받는 방법</span>
                    </div>
                    <ChevronRight size={20} />
                </button>
                <button className="w-full bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="/api/placeholder/24/24" alt="Icon" className="mr-2" />
                        <span>굿즈로 펀 모으기해 보실래요?</span>
                    </div>
                    <ChevronRight size={20} />
                </button>
            </div>


            <div className="mt-6 space-y-4">
                <div className="space-y-2">
                    <MenuItem icon={<Star size={20} />} text="최근 본" />
                    <MenuItem icon={<Users size={20} />} text="팔로잉" />
                    <MenuItem icon={<TrendingUp size={20} />} text="투자 관리" />
                </div>

                <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-2">나의 문의 내역</h3>
                    <MenuItem icon={<Mail size={20} />} text="메이커 문의" />
                    <MenuItem icon={<LayoutGrid size={20} />} text="스타트업 문의" />
                </div>

                <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-2">고객센터</h3>
                    <MenuItem icon={<MessageSquare size={20} />} text="1:1 채팅 상담" />
                    <MenuItem icon={<Megaphone size={20} />} text="공지사항" />
                    <MenuItem icon={<MessageSquare size={20} />} text="도움말 센터" />
                    <MenuItem icon={<UserPlus size={20} />} text="친구 초대하기" />
                    <MenuItem icon={<Settings size={20} />} text="설정" />
                </div>
            </div>
        </div>
    );

};

export default UserProfile;