import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About/AboutPage";
import ContactPage from "./pages/Contact/ContactPage";
import ReviewsPage from "./pages/Reviews/ReviewsPage";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            {/* TODO: ADD OTHER ROUTES */}
            {/* DEFAULT ROUTE 404 ROUTE */}
            <Route path="*" element={<h1>404</h1>} />
        </Routes>
    );
}

export default Router;