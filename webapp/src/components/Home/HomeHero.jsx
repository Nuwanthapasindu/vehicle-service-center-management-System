import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/imgs/home/hero.png';
import './HomeHero.css';

const HomeHero = () => {
    return (
        <section className="home-hero">
            <div className="home-hero-bg">
                <img src={heroImg} alt="Master Detailing" />
                <div className="home-hero-overlay"></div>
            </div>
            
            <div className="home-hero-content">
                <span className="hero-status-tag">
                    <i className="fa-solid fa-circle"></i> NOW ACCEPTING BOOKINGS
                </span>
                <h1 className="m-hero-title">
                    Precision Detailing <br/>
                    <span>For The Driven.</span>
                </h1>
                <p className="m-body-text" style={{color: '#FFFFFF', opacity: 0.8, margin: '0 auto 3.5rem'}}>
                    Experience the ultimate in automotive care. Professional ceramic coating, 
                    interior restoration, and paint protection designed for car enthusiasts.
                </p>
                <div className="home-hero-btns">
                    <Link to="/customer/service-booking" className="m-btn-lime">
                        Book Your Slot <i className="fa-solid fa-calendar-alt"></i>
                    </Link>
                    <Link to="/about" className="m-btn-outline" style={{borderColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF'}}>
                        View Services
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;
