import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGalleryImages } from "../../services/galleryService";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SEO from "../../components/SEO/SEO";
import getImageUrl from "../../util/getImageUrl";
import "./GalleryPage.css";

const PAGE_LIMIT = 12; // Adjusted for better grid layout

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Lightbox State
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchInitialImages();
  }, []);

  const fetchInitialImages = async () => {
    try {
      setLoading(true);
      const response = await getGalleryImages({ page: 1, limit: PAGE_LIMIT });
      if (response && response.payload) {
        setImages(response.payload.images || []);
        setHasMore(response.payload.page < response.payload.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreImages = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await getGalleryImages({ page: nextPage, limit: PAGE_LIMIT });
      
      if (response && response.payload) {
        const newImages = response.payload.images || [];
        setImages((prev) => [...prev, ...newImages]);
        setPage(nextPage);
        setHasMore(response.payload.page < response.payload.totalPages);
      }
    } catch (error) {
      console.error("Failed to load more images:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const openLightbox = (imageUrl) => {
    setSelectedImage(imageUrl);
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="gallery-page-wrapper">
      <SEO 
        title="Work Gallery & Transformations"
        description="Explore our work gallery showing stunning car detailing transformations, exterior paint correction, premium ceramic coating, and professional car wash results at Shine Depot Nugegoda."
        keywords="Shine Depot gallery, car detailing portfolio, ceramic coating showcase, before and after car detailing, luxury car wash gallery"
        path="/gallery"
      />
      <Header />
      <main>
        {/* Hero Section */}
        <div className="gallery-hero">
            <div className="m-container">
                <span className="m-section-tag">Visual Showcase</span>
                <h1 className="m-hero-title">Experience Excellence <span>Through Our Lens.</span></h1>
                <p className="m-body-text">
                    A curated collection of our most significant transformations. 
                    From exotic detailing to rugged restorations, see the precision in every pixel.
                </p>
            </div>
        </div>

        <section className="gallery-main-section">
          <div className="m-container">
            {/* Content Section */}
            <div className="gallery-content-area">
              {loading ? (
                <div className="loading-state-container">
                  <div className="spinner-glow"></div>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <p>Initializing Gallery...</p>
                </div>
              ) : images.length > 0 ? (
                <>
                  <div className="gallery-masonry-grid">
                    {images.map((item, index) => (
                      <div 
                        key={item._id || index} 
                        className="gallery-card-modern"
                        onClick={() => openLightbox(getImageUrl(item.image?.filePath))}
                      >
                        <div className="card-image-wrapper">
                          <img
                            src={getImageUrl(item.image?.filePath)}
                            alt="Vehicle Service"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                            }}
                          />
                          <div className="card-overlay">
                             <div className="overlay-icon">
                                <i className="fa-solid fa-expand"></i>
                             </div>
                             <span className="view-text">Full Resolution</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="load-more-container">
                      <button 
                        className="load-more-btn-premium" 
                        onClick={loadMoreImages}
                        disabled={loadingMore}
                      >
                        {loadingMore ? (
                          <i className="fa-solid fa-spinner fa-spin"></i>
                        ) : (
                          <>
                            <span>Discover More</span>
                            <i className="fa-solid fa-arrow-down-long"></i>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-gallery-state">
                  <div className="empty-icon-box">
                    <i className="fa-regular fa-image"></i>
                  </div>
                  <h3>No Assets Found</h3>
                  <p>Our gallery is currently undergoing maintenance. Please check back later.</p>
                  <Link to="/" className="m-primary-btn">Back to Home</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
           <div className="lightbox-close" onClick={closeLightbox}>
              <i className="fa-solid fa-xmark"></i>
           </div>
           <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage} alt="Large preview" />
           </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
