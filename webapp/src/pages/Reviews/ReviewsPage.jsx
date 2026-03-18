import React from 'react';
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import ReviewsHero from "./components/ReviewsHero/ReviewsHero";
import ReviewsList from "./components/ReviewsList/ReviewsList";
import "./ReviewsPage.css";

function ReviewsPage() {
    return (
        <div className="reviews-page-container">
            <Navbar />
            <main>
                <ReviewsHero />
                <ReviewsList />
            </main>
            <Footer />
        </div>
    );
}

export default ReviewsPage;
