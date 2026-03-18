import React from 'react';
import './Gallery.css';

function Gallery() {
    const images = [
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&q=80",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
        "https://images.unsplash.com/photo-1503376710356-70ceb80bb83e?w=600&q=80",
        "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=600&q=80",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80",
        "https://images.unsplash.com/photo-1550505095-81378a675f04?w=600&q=80"
    ];

    return (
        <section className="gallery-section">
            <div className="gallery-container">
                <div className="gallery-header">
                    <h2 className="gallery-title">GALLERY OF EXCELLENCE</h2>
                    <p className="gallery-subtitle">
                        Browse through our curated collection of transformations across luxury, sports, and classic categories.
                    </p>
                </div>

                <div className="gallery-grid">
                    {images.map((src, index) => (
                        <div key={index} className="gallery-item">
                            <img src={src} alt={`Gallery item ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Gallery;
