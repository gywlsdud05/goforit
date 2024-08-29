import React, { useState, useEffect } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { supabase } from '../supabase.client';
import { useParams, useNavigate } from 'react-router-dom'; // useParams 훅을 가져옵니다.
import { create } from 'zustand';
import * as PortOne from '@portone/browser-sdk/v2';
import axios from 'axios';

const verifyPayment = async (orderAmount, payment_id) => {
    try {
        console.log("Verifying payment with data:", { orderAmount, payment_id });
        const { data, error } = await supabase.functions.invoke('verify-payment', {
            body: { orderAmount, payment_id }
        });
        if (error) {
            console.error("Supabase function error:", error);
            throw error;
        }
        if (!data.verified) {
            throw new Error(data.message || '결제 검증에 실패했습니다.');
        }
        console.log("Verification result:", data);
        return data;
    } catch (error) {
        console.error('Error in verifyPayment:', error);
        if (error.message === 'FunctionsHttpError: Edge Function returned a non-2xx status code') {
            console.error('Response details:', error.details);
        }
        throw error;
    }
};

const ProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // URL 파라미터에서 ID 가져오기
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [orderPayment, setOrderPayment] = useState(null);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [fundingInProgress, setFundingInProgress] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);

    const images = [
        '/path/to/image1.jpg',
        '/path/to/image2.jpg',
        'http://via.placeholder.com/300x200',
        // ... more images
    ];


    useEffect(() => {
        const fetchData = async () => {
            // 'id'가 정의되지 않았다는 오류를 방지하기 위해 useParams로 가져온 'id'를 사용
            if (!id) {
                setError('No product ID provided');
                setLoading(false);
                return;
            }
            try {
                const [productData, userData] = await Promise.all([
                    fetchProductData(id),
                    fetchUserData()
                ]);

                setProduct(productData);
                setUser(userData);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const fetchProductData = async (id) => {
        const { data, error } = await supabase
            .from('products')
            .select('id, product_id, title, summary, price')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) throw new Error('Product not found');

        return data;
    };

    const fetchUserData = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) throw new Error('User not authenticated');

        const { data, error: userDataError } = await supabase
            .from('users')
            .select('user_id, nickname')
            .eq('user_id', user.id)
            .single();

        if (userDataError) throw userDataError;
        return data;
    };


    useEffect(() => {
        if (paymentStatus === 'completed') {
            navigate('/payment-success');
        }
    }, [paymentStatus, navigate]);

    const handleFunding = async (product, user) => {
        console.log('Product:', product);
        console.log('User:', user);
        if (!product || !user) {
            setError('Product or user information not available');
            return;
        }

        console.log('Starting funding process');
        setFundingInProgress(true);
        setError(null);
        setPaymentStatus(null);

        try {
            const orderPayment = await createOrderPayment(product, user);
            console.log('Order payment created:', orderPayment);
            await handlePayment(orderPayment, user);
        } catch (err) {
            console.error('Funding Error:', err);
            setError(err.message);
            setPaymentStatus('failed');
        } finally {
            setFundingInProgress(false);
        }
    };

    const createOrderPayment = async (product, user) => {
        const { data, error } = await supabase
            .from('orderPayment')
            .insert({
                buyer_id: user.user_id,
                good_id: product.product_id,
                amountOfproduct: product.price,
                goodName: product.title,
                payment_status: 'pending',
                payment_id: `payment-${crypto.randomUUID()}`,
                payMethod: 'CARD' // 또는 다른 적절한 기본값
            })
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new Error('Failed to create order payment');

        return data;
    };
    const handlePayment = async (orderPayment, user) => {
        console.log('Initiating payment', orderPayment);
        const paymentData = {
            storeId: "store-d0e48c91-3c3f-4a73-80d7-ba3ed035b656",
            channelKey: "channel-key-708650d5-9c0e-4fdc-b2c8-d2da57977f3a",
            paymentId: orderPayment.payment_id,
            totalAmount: orderPayment.amountOfproduct,
            orderName: orderPayment.goodName,
            currency: "CURRENCY_KRW",
            payMethod: "CARD",
            buyer_name: user.nickname || 'Unnamed',
            buyer_email: user.email || 'user@example.com',
            buyer_tel: '01012341234',
            buyer_addr: '신사동 661-16',
            buyer_postcode: '06018',
        };
        try {
            console.log('paymentData', paymentData);
            const response = await PortOne.requestPayment(paymentData);

            if (response.code != null) {
                // 오류 발생
                console.error('Payment initiation error:', response.message);
                await updateOrderStatus(orderPayment.payment_id, 'failed');
                setError(response.message);
                return;
            }
            await callback(response, orderPayment);
        } catch (error) {
            console.error('Payment initiation error:', error);
            await updateOrderStatus(orderPayment.payment_id, 'failed');
            setError('Payment initiation failed. Please try again.');
        }
    };

    const callback = async (response, orderPayment) => {
        console.log('Payment response received', response);

        try {
            console.log('Verifying payment');
            const result = await verifyPayment(orderPayment.amountOfproduct, orderPayment.payment_id);
            setVerificationStatus(result.verified ? 'success' : 'failed');

            if (result.verified) {
                console.log('Payment verified, updating order status');
                setPaymentStatus('completed');
                navigate('/payment-success', {
                    state: {
                        orderDetails: {
                            orderId: orderPayment.payment_id,
                            productName: orderPayment.goodName,
                            amount: orderPayment.amountOfproduct
                        }
                    }
                });
            } else {
                throw new Error(`Payment verification failed: ${result.status}`);
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            await updateOrderStatus(orderPayment.payment_id, 'failed');
            setError(error.message || 'Payment processing failed. Please try again.');
        }
    };

    const updateOrderStatus = async (payment_id, status) => {
        console.log(`Updating order status: ${payment_id} to ${status}`);
        const { data, error } = await supabase
            .from('orderPayment')
            .update({ payment_status: status })
            .eq('payment_id', payment_id)
            .select();

        if (error) throw error;
        if (data && data.length > 0) {
            console.log('Order status updated successfully:', data[0]);
            return { success: true, data: data[0] };
        } else {
            console.error('No rows were updated');
            return { success: false, error: 'No rows were updated' };
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product || !user) return <div>Product or user information not available</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Image Slider */}
                <div className="md:w-1/2 relative">
                    <img src={images[currentImage]} alt="Product" className="w-full rounded-lg" />
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {currentImage + 1}/{images.length}
                    </div>
                    <button onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">&lt;</button>
                    <button onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">&gt;</button>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2">
                    <div className="bg-blue-100 text-blue-800 inline-block px-2 py-1 rounded mb-2">애니메이션  굿즈</div>
                    <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
                    <p className="text-gray-600 mb-4">{product.summary}</p>

                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <div className="text-4xl font-bold text-blue-600 mb-2">4,529<span className="text-sm text-gray-500">% 달성</span></div>
                        <div className="text-2xl font-semibold">22,647,700<span className="text-sm text-gray-500">원 달성</span></div>
                        <div className="text-sm text-gray-500">535명 참여</div>
                    </div>

                    <button className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold mb-4"
                        onClick={() => handleFunding(product, user)} disabled={loading}
                    >{loading ? 'Processing...' : '펀딩하기'}</button>


                    <div className="flex justify-between">
                        <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                            <Heart size={20} /> 2,855
                        </button>
                        <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                            <Share2 size={20} /> 공유
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ProductPage;