import React from 'react';
import './HomeStats.css';

const HomeStats = () => {
    return (
        <section className="home-stats">
            <div className="stats-inner">
                <div className="stat-card">
                    <div className="stat-icon"><i className="fa-solid fa-shield-check"></i></div>
                    <div className="stat-info">
                        <h3>1,200+</h3>
                        <span>CARS PROTECTED</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon star"><i className="fa-solid fa-star"></i></div>
                    <div className="stat-info">
                        <h3>4.9/5.0</h3>
                        <span>CLIENT RATING</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon award"><i className="fa-solid fa-award"></i></div>
                    <div className="stat-info">
                        <h3>CERAMIC PRO</h3>
                        <span>CERTIFIED INSTALLER</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon car"><i className="fa-solid fa-clock-rotate-left"></i></div>
                    <div className="stat-info">
                        <h3>12 YEARS</h3>
                        <span>COMBINED EXPERIENCE</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeStats;
