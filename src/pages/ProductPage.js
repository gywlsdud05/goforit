import { supabase } from "../supabase.client";
import CompanyFooter from "./CompanyFooter";
import Header from "./Header";
import styles from "./ProductPage.module.css";
import ShareModal from "./ShareModal";
import useFunding from "./useFunding";
import { Toaster } from "@/components/ui/toaster";
import { Heart, Share2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [setError] = useState(null);

  const {
    error,
    paymentStatus,
    fundingInProgress,
    verificationStatus,
    handleFunding,
  } = useFunding();

  const images = [
    "/path/to/image1.jpg",
    "/path/to/image2.jpg",
    "http://via.placeholder.com/300x200",
    // ... more images
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No product ID provided");
        setLoading(false);
        return;
      }
      try {
        const [productData, userData] = await Promise.all([
          fetchProductData(id),
          fetchUserData(),
        ]);

        setProduct(productData);
        setUser(userData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchProductData = async (id) => {
    const { data, error } = await supabase
      .from("products")
      .select("id, product_id, title, summary, price, mainCategory")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Product not found");

    return data;
  };

  const fetchUserData = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error("User not authenticated");

    const { data, error: userDataError } = await supabase
      .from("users")
      .select("user_id, nickname")
      .eq("user_id", user.id)
      .single();

    if (userDataError) throw userDataError;
    return data;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product || !user)
    return <div>Product or user information not available</div>;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          {/* Image Slider */}
          <div className={styles.imageContainer}>
            <img
              src={images[currentImage]}
              alt="Product"
              className={styles.productImage}
            />
            <div className={styles.imageCounter}>
              {currentImage + 1}/{images.length}
            </div>
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className={`${styles.imageButton} ${styles.leftButton}`}
            >
              &lt;
            </button>
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className={`${styles.imageButton} ${styles.rightButton}`}
            >
              &gt;
            </button>
          </div>

          {/* Product Info */}
          <div className={styles.productInfo}>
            <div className={styles.categoryTag}>{product.mainCategory}</div>
            <h1 className={styles.productTitle}>{product.title}</h1>
            <p className={styles.productSummary}>{product.summary}</p>

            <div className={styles.fundingInfo}>
              <div className={styles.fundingPercentage}>
                4,529<span className={styles.percentSymbol}>% 달성</span>
              </div>
              <div className={styles.fundingAmount}>
                22,647,700<span className={styles.currency}>원 달성</span>
              </div>
              <div className={styles.participantCount}>535명 참여</div>
            </div>

            <button
              className={styles.fundButton}
              onClick={() => handleFunding(product, user)}
              disabled={fundingInProgress}
            >
              {fundingInProgress ? "Processing..." : "펀딩하기"}
            </button>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {paymentStatus && (
              <div className={styles.paymentStatus}>
                Payment Status: {paymentStatus}
              </div>
            )}
            {verificationStatus && (
              <div className={styles.verificationStatus}>
                Verification Status: {verificationStatus}
              </div>
            )}

            <div className={styles.actionButtons}>
              <button className={styles.actionButton}>
                <Heart size={20} /> 2,855
              </button>
              <button
                className={styles.actionButton}
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 size={20} /> 공유
              </button>
            </div>
          </div>
        </div>

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          url={window.location.href}
          title={product.title}
          summary={product.summary}
        />
      </div>
      <CompanyFooter />
      <Toaster />
    </>
  );
};

export default ProductPage;
