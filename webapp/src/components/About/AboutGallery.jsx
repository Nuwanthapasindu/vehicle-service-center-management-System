import React, { useState, useEffect } from 'react';
import { getGalleryImages } from "../../services/galleryService";
import getImageUrl from "../../util/getImageUrl";
import './AboutGallery.css';

const AboutGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestImages = async () => {
            try {
                const response = await getGalleryImages({ page: 1, limit: 6 });
                if (response && response.payload) {
                    setImages(response.payload.images || []);
                }
            } catch (error) {
                console.error("Failed to fetch about gallery images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestImages();
    }, []);

    if (loading) {
        return (
            <section className="gallery-section">
                <div className="gallery-loading">
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                </div>
            </section>
        );
    }

    if (images.length === 0) {
        return null; // Or show fallback static images if preferred
    }

    return (
        <section className="gallery-section">
            <div className="gallery-header">
                <h2>GALLERY OF EXCELLENCE</h2>
                <p>Explore how we transform automotive surfaces across clouds, roads, and track categories.</p>
            </div>

            <div className="gallery-grid">
                {images.map((item, index) => (
                    <div key={item._id || index} className="gallery-item shadow-hover">
                        <img 
                            src={getImageUrl(item.image?.filePath)} 
                            alt={`Gallery asset ${index + 1}`}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutGallery;
