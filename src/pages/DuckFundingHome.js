// 필요한 module과 component들을 import합니다.
import styles from './DuckFundingHome.css';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Heart, ArrowUp } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from '../supabase.client';
import useAuthStore from '../store/useAuthStore';
import InfiniteScroll from 'react-infinite-scroller';
import SkeletonProduct from './SkeletonProduct';
import useScrollPosition from '../components/useScrollPosition';
import SlideComponent from './SlideComponent';

const DuckFundingHome = () => {
  // 상태 변수들을 선언합니다.
  const [products, setProducts] = useState([]); // 제품 목록
  const [error, setError] = useState(null); // error 상태
  const [page, setPage] = useState(0); // 현재 page number
  const [totalProducts, setTotalProducts] = useState(null); // 총 제품 수
  const [showScrollTop, setShowScrollTop] = useState(false); // 스크롤 탑 버튼 표시 여부
  const [likedProducts, setLikedProducts] = useState(new Set()); // 좋아요 한 제품 목록
  const [loadingMore, setLoadingMore] = useState(false); // 추가 로딩 중 여부
  const [hasMore, setHasMore] = useState(true); // 더 불러올 제품이 있는지 여부
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태

  // 라우팅 및 인증 관련 훅을 사용합니다.
  const navigate = useNavigate();
  const location = useLocation();
  const { user, initializeAuth } = useAuthStore();
  const { scrollToTop } = useScrollPosition('duckFundingScrollPosition');

  // 상수를 정의합니다.
  const PRODUCTS_PER_PAGE = 8;

  // 더 많은 제품을 로드하는 함수입니다.
  const loadMoreProducts = () => {
    if (loadingMore) {
      console.log('Already loading more products, skipping fetch');
      return;
    }
    if (!loadingMore && hasMore) {
      console.log('Loading more products');
      fetchProducts(page, likedProducts);
      console.log('loadMoreProducts called', { loadingMore, hasMore, page });
    }
  };

  // component가 마운트될 때 인증을 초기화합니다.
  useEffect(() => {
    const init = async () => {
      console.log('Component mounted');
      await initializeAuth();
      console.log('Auth initialized');
    };

    init();
  }, []);

  // 제품을 가져오는 function입니다.
  const fetchProducts = useCallback(async (pageNumber) => {
    console.log(`Attempting to fetch products for page ${pageNumber}`);
    setLoadingMore(true);
    setError(null);

    try {
      const currentPage = pageNumber;
      const from = currentPage * PRODUCTS_PER_PAGE;
      const to = from + PRODUCTS_PER_PAGE - 1;

      console.log(`Fetching products from ${from} to ${to}`);

      // 전체 제품 수를 먼저 확인합니다.
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      console.log(`Total products count: ${count}`);
      setTotalProducts(count);

      // 남은 product가 없으면 여기서 중단합니다.
      if (from >= count) {
        console.log('No more products to fetch');
        setHasMore(false);
        return;
      }

      // product data를 가져옵니다.
      const { data, error } = await supabase
        .from('products')
        .select(`*`)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      console.log(`Fetched ${data.length} products`);
      setTotalProducts(count);

      // 사용자가 login 한 경우에만 좋아요 정보를 가져옵니다.
      let userLikes = new Set();
      if (user) {
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('product_id')
          .eq('user_id', user.user_id);

        if (likesError) throw likesError;

        userLikes = new Set(likesData.map(like => like.product_id));
      }

      setLoadingMore(prev => {
        console.log(`LoadingMore set to: ${!prev}`);
        return true;
      });

      console.log('Fetched data:', data, 'Total count:', count);

      // 가져온 product data를 형식화합니다.
      if (data && data.length > 0) {
        const formattedProducts = data.map(product => {
          console.log('Processing product:', JSON.stringify(product, null, 2));

          return {
            id: product.id,
            product_id: product.product_id,
            image: product.image_url,
            title: product.title,
            percentage: product.current_amount && product.goal_amount
              ? `${Math.floor((product.current_amount / product.goal_amount) * 100)}%`
              : 'N/A',
            remaining: product.end_date
              ? `${Math.max(0, Math.floor((new Date(product.end_date) - new Date()) / (1000 * 60 * 60 * 24)))}일 남음`
              : 'N/A',
            backers: product.backers_count ? `${product.backers_count}명` : 'N/A',
            created_at: product.created_at,
            isLiked: user ? userLikes.has(product.product_id) : false
          };
        });

        console.log('Formatted products:', formattedProducts);
        console.log('Raw fetched data:', JSON.stringify(data, null, 2));

        // product 목록을 update합니다.
        setProducts(prevProducts => {
          const newProducts = [...prevProducts, ...formattedProducts];
          return Array.from(new Set(newProducts.map(p => p.id)))
            .map(id => newProducts.find(p => p.id === id));
        });

        setPage(prevPage => {
          console.log('Updated page:', prevPage + 1);
          return prevPage + 1;
        });

        const hasMoreProducts = (currentPage + 1) * PRODUCTS_PER_PAGE < count;
        setHasMore(hasMoreProducts);
        console.log('hasMore updated:', { fetchedCount: data.length, totalCount: count });

        setIsLoading(false);
      } else {
        console.log('No more products to fetch');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('제품을 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.');
      setHasMore(false);
      setIsLoading(false);
    } finally {
      console.log('Fetch completed');
      setLoadingMore(false);
    }
  }, []);

  // like toggle function입니다.
  const toggleLike = async (productId) => {
    if (!user) {
      alert('좋아요 기능을 사용하려면 로그인이 필요합니다.');
      return;
    }
    if (!productId) {
      console.error('Invalid productId:', productId);
      return;
    }

    const isLiked = likedProducts.has(productId);

    try {
      if (isLiked) {
        // like delete
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.user_id)
          .eq('product_id', productId);

        console.log(`user_id of toggleLike :`, user.user_id);

        if (error) throw error;

        setLikedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        // like add
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.user_id, product_id: productId });

        if (error) throw error;

        setLikedProducts(prev => new Set(prev).add(productId));
      }

      // product 목록에서 해당 product의 좋아요 상태 update
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.product_id === productId
            ? { ...product, isLiked: !isLiked }
            : product
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      console.log('User ID:', user.user_id);
      console.log('Product ID:', productId);
      alert('좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 제품 클릭 핸들러입니다.
  const handleProductClick = (productId) => {
    navigate(`/productPage/${productId}`);
  };

  // 제품 목록을 메모이제이션합니다.
  const memoizedProducts = useMemo(() => products, [products]);

  // 컴포넌트를 렌더링합니다.
  return (
    <div className={styles.duckfundingHome}>
      <main>
        <SlideComponent/>

        {error ? (
          // 에러 메시지를 표시합니다.
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={() => fetchProducts(0)}>다시 시도</button>
          </div>
        ) : isLoading ? (
          // 로딩 중일 때 스켈레톤 UI를 표시합니다.
          <div className={styles.productGrid}>
            {[...Array(8)].map((_, index) => (
              <SkeletonProduct key={index} />
            ))}
          </div>
        ) : totalProducts === 0 ? (
          // 제품이 없을 때 메시지를 표시합니다.
          <p className={styles.noProductsMessage}>표시할 제품이 없습니다.</p>
        ) : (
          // 제품 목록을 무한 스크롤로 표시합니다.
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMoreProducts}
            hasMore={hasMore}
            loader={<div className={styles.loader} key={0}>추가 제품을 불러오는 중...</div>}
            threshold={250}
            useWindow={true}
          >
            <div className={styles.productGrid}>
              {products.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className={styles.productItem}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className={styles.productImage} style={{ backgroundImage: `url(${product.image})` }}>
                    <button
                      className={`${styles.likeButton} ${product.isLiked ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.product_id) {
                          toggleLike(product.product_id);
                        } else {
                          console.error('Product ID is undefined:', product);
                        }
                      }}
                    >
                      <Heart size={20} fill={product.isLiked ? "#ff4081" : "none"} />
                    </button>
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.title}</h3>
                    <div className={styles.productStats}>
                      <span className={styles.percentage}>{product.percentage} 달성</span>
                      <span className={styles.remaining}>{product.remaining}</span>
                    </div>
                    <div className={styles.backers}>{product.backers}</div>
                  </div>
                </div>
              ))}

              {!hasMore && <p className={styles.allIoadedMessage}>모든 제품을 불러왔습니다.</p>}
            </div>
          </InfiniteScroll>
        )}
        {showScrollTop && (
          <button className={styles.scrollToTop} onClick={scrollToTop}>
            <ArrowUp size={24} />
          </button>
        )}
      </main>
    </div>
  );
};

// 메모이제이션된 ProductItem 컴포넌트입니다.
const ProductItem = React.memo(({ product, onLike }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/productPage/${product.id}`);
  };

  return (
    <div className={styles.productItem} onClick={handleProductClick}>
      <div className={styles.productImage} style={{ backgroundImage: `url(${product.image})` }}>
        <button
          className={`${styles.likeButton} ${product.isLiked ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onLike(product.product_id);
          }}
        >
          <Heart size={20} fill={product.isLiked ? "#ff4081" : "none"} />
        </button>
      </div>
      <div className={styles.productInfo}>
        <h3>{product.title}</h3>
        <div className={styles.productStats}>
          <span className={styles.percentage}>{product.percentage} 달성</span>
          <span className={styles.remaining}>{product.remaining}</span>
        </div>
        <div className={styles.backers}>{product.backers}</div>
      </div>
    </div>
  );
});

export default DuckFundingHome;