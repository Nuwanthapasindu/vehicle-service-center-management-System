import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AboutHero from '../../components/About/AboutHero';
import AboutVision from '../../components/About/AboutVision';
import AboutGallery from '../../components/About/AboutGallery';
import AboutCTA from '../../components/About/AboutCTA';
import SEO from '../../components/SEO/SEO';
import './AboutPage.css';

function AboutPage() {
    return (
        <div className="about-page-wrapper">
            <SEO 
                title="About Us"
                description="Learn about Shine Depot, Nugegoda's trusted full-service automotive care center. Discover our commitment to high-quality workmanship, attention to detail, and reliable vehicle servicing."
                keywords="Shine Depot history, about Shine Depot, professional detailers Nugegoda, auto care team, vehicle servicing experts"
                path="/about"
            />
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