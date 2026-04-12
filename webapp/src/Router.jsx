import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage/RegisterPage";
import OTPVerificationPage from "./pages/auth/OTPVerificationPage/OTPVerificationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage/ResetPasswordPage";
import CustomerDashboard from "./pages/Customer/Dashboard/Dashboard";
import MyGarage from "./pages/Customer/MyGarage/MyGarage";
import AddVehicle from "./pages/Customer/MyGarage/AddVehicle";
import VehicleDetails from "./pages/Customer/MyGarage/VehicleDetails";
import ServiceHistory from "./pages/Customer/ServiceHistory/ServiceHistory";
import ServiceBooking from "./pages/Customer/ServiceBooking/ServiceBooking";
import Profile from "./pages/Customer/Profile/Profile";
import WriteReview from "./pages/Customer/WriteReview/WriteReview";
import MyReviews from "./pages/Customer/MyReviews/MyReviews";
import EditReview from "./pages/Customer/EditReview/EditReview";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import ReviewsPage from "./pages/ReviewsPage/ReviewsPage";

import AuthGuard from "./guards/AuthGuard";
import PublicAuthGuard from "./guards/PublicAuthGuard";

function Router() {
  return (
    <Routes>
      {/* Public Pages */}

      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />

      <Route
        path="/login"
        element={
          <PublicAuthGuard>
            <LoginPage />
          </PublicAuthGuard>
        }
      />
      <Route
        path="/register"
        element={
          <PublicAuthGuard>
            <RegisterPage />
          </PublicAuthGuard>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <PublicAuthGuard>
            <OTPVerificationPage />
          </PublicAuthGuard>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicAuthGuard>
            <ForgotPasswordPage />
          </PublicAuthGuard>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicAuthGuard>
            <ResetPasswordPage />
          </PublicAuthGuard>
        }
      />

      {/* Customer Routes */}
      <Route
        path="/customer/dashboard"
        element={
          <AuthGuard>
            <CustomerDashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/customer/my-garage"
        element={
          <AuthGuard>
            <MyGarage />
          </AuthGuard>
        }
      />
      <Route
        path="/customer/my-garage/add"
        element={
          <AuthGuard>
            <AddVehicle />
          </AuthGuard>
        }
      />
      <Route
        path="/customer/my-garage/:id"
        element={
          <AuthGuard>
            <VehicleDetails />
          </AuthGuard>
        }
      />
      <Route
        path="/customer/service-history"
        element={
          <AuthGuard>
            <ServiceHistory />
          </AuthGuard>
        }
      />
      <Route
        path="/customer/service-booking"
        element={
          <AuthGuard>
            <ServiceBooking />
          </AuthGuard>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        }
      />
      <Route
        path="/customer/reviews/write/:bookingId"
        element={
          <AuthGuard>
            <WriteReview />
          </AuthGuard>
        }
      />
      <Route
        path="/customer/reviews/edit/:reviewId"
        element={
          <AuthGuard>
            <EditReview />
          </AuthGuard>
        }
      />

      <Route
        path="/customer/reviews"
        element={
          <AuthGuard>
            <MyReviews />
          </AuthGuard>
        }
      />




      {/* TODO: ADD OTHER ROUTES */}
      {/* DEFAULT ROUTE 404 ROUTE */}
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default Router;
