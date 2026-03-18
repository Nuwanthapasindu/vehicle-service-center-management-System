import React from 'react';
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import MapHero from "./components/MapHero/MapHero";
import ContactOptions from "./components/ContactOptions/ContactOptions";
import "./ContactPage.css";

function ContactPage() {
    return (
        <div className="contact-page-container">
            <Navbar />
            <main>
                <MapHero />
                <ContactOptions />
            </main>
            <Footer />
        </div>
    );
}

export default ContactPage;
