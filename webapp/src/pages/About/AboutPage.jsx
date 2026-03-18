import React from 'react';
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import AboutHero from "./components/AboutHero/AboutHero";
import VisionMission from "./components/VisionMission/VisionMission";
import Gallery from "./components/Gallery/Gallery";
import AboutCTA from "./components/AboutCTA/AboutCTA";
import "./AboutPage.css";

function AboutPage() {
    return (
        <div className="about-page-container">
            <Navbar />
            <main>
                <AboutHero />
                <VisionMission />
                <Gallery />
                <AboutCTA />
            </main>
            <Footer />
        </div>
    );
}

export default AboutPage;
