import React from 'react';
import './AboutGallery.css';

// Gallery images
import g1 from '../../assets/imgs/about/gallery1.png';
import g2 from '../../assets/imgs/about/gallery2.png';
import g3 from '../../assets/imgs/about/gallery3.png';
import g4 from '../../assets/imgs/about/gallery4.png';
import g5 from '../../assets/imgs/about/gallery5.png';
import g6 from '../../assets/imgs/about/gallery6.png';

const AboutGallery = () => {
    return (
        <section className="gallery-section">
            <div className="gallery-header">
                <h2>GALLERY OF EXCELLENCE</h2>
                <p>Explore how we transform automotive surfaces across clouds, roads, and track categories.</p>
            </div>

            <div className="gallery-grid">
                <div className="gallery-item shadow-hover"><img src={g1} alt="Red Porsche" /></div>
                <div className="gallery-item shadow-hover"><img src={g2} alt="Black SUV" /></div>
                <div className="gallery-item shadow-hover"><img src={g3} alt="Silver Lamborghini" /></div>
                <div className="gallery-item shadow-hover"><img src={g4} alt="Blue Ferrari" /></div>
                <div className="gallery-item shadow-hover"><img src={g5} alt="Classic Mustang" /></div>
                <div className="gallery-item shadow-hover"><img src={g6} alt="Bentley Interior" /></div>
            </div>
        </section>
    );
};

export default AboutGallery;
