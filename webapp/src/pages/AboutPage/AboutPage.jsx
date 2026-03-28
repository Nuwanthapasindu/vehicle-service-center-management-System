import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AboutHero from '../../components/About/AboutHero';
import AboutVision from '../../components/About/AboutVision';
import AboutGallery from '../../components/About/AboutGallery';
import AboutCTA from '../../components/About/AboutCTA';
import './AboutPage.css';

function AboutPage() {
    return (
        <div className="about-page-wrapper">
            <Header />
            <main>
                <AboutHero />
                <AboutVision />
                <AboutGallery />
                <AboutCTA />
            </main>
            <Footer />
        </div>
    );
}

export default AboutPage;