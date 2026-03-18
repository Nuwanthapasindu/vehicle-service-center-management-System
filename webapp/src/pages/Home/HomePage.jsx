import React from 'react';
import "./HomePage.css";
import Navbar from "../../components/layout/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Testimonials from "./components/Testimonials/Testimonials";
import CTA from "./components/CTA/CTA";
import Footer from "../../components/layout/Footer/Footer";

function HomePage() {
  return (
    <div className="home-page-container">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;