import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HomeHero from '../../components/Home/HomeHero';
import HomeStats from '../../components/Home/HomeStats';
import HomeServices from '../../components/Home/HomeServices';
import HomeTestimonials from '../../components/Home/HomeTestimonials';
import HomeCTA from '../../components/Home/HomeCTA';
import './HomePage.css';

function HomePage() {
    return (
        <div className="home-page-wrapper">
            <Header />
            <main>
                <HomeHero />
                <HomeStats />
                <HomeServices />
                <HomeTestimonials />
                <HomeCTA />
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;