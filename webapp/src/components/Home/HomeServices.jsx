import React from 'react';
import './HomeServices.css';
import ceramicImg from '../../assets/imgs/home/ceramic.png';
import interiorImg from '../../assets/imgs/home/interior.png';
import exteriorImg from '../../assets/imgs/home/exterior.png';

const HomeServices = () => {
    return (
        <section className="home-services m-section-padding">
            <div className="m-container m-centered">
                <span className="m-section-tag">ELITE MAINTENANCE</span>
                <h2 className="m-section-title">Our Professional Services</h2>
            </div>

            <div className="m-container">
                <div className="services-grid">
                    <div className="service-card shadow-sm">
                        <div className="service-img">
                            <img src={ceramicImg} alt="Ceramic Coating" />
                        </div>
                        <div className="service-info">
                            <h3>Ceramic Coating</h3>
                            <p className="m-body-text" style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>Long-lasting protection and mirror-like finish with the hardest technology. Protect against UV, salt, and chemicals.</p>
                            <div className="service-price">
                                From $499
                            </div>
                        </div>
                    </div>

                    <div className="service-card shadow-sm">
                        <div className="service-img">
                            <img src={interiorImg} alt="Interior Restoration" />
                        </div>
                        <div className="service-info">
                            <h3>Interior Restoration</h3>
                            <p className="m-body-text" style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>Deep clean, conditioning, and odor removal. We restore every surface including leather, alcantara, and carpets.</p>
                            <div className="service-price">
                                From $199
                            </div>
                        </div>
                    </div>

                    <div className="service-card shadow-sm">
                        <div className="service-img">
                            <img src={exteriorImg} alt="Full Exterior Prep" />
                        </div>
                        <div className="service-info">
                            <h3>Full Exterior Prep</h3>
                            <p className="m-body-text" style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>Touchless wash and hand-polished perfection. Multi-stage wash process to ensure a scratch-free showroom shine.</p>
                            <div className="service-price">
                                From $149
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeServices;
