import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import OTPVerificationPage from "./pages/OTPVerificationPage/OTPVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import CustomerDashboard from "./pages/Customer/Dashboard/Dashboard";
import MyGarage from "./pages/Customer/MyGarage/MyGarage";
import AddVehicle from "./pages/Customer/MyGarage/AddVehicle";
import VehicleDetails from "./pages/Customer/MyGarage/VehicleDetails";
import ServiceHistory from "./pages/Customer/ServiceHistory/ServiceHistory";
import ServiceBooking from "./pages/Customer/ServiceBooking/ServiceBooking";
import Profile from "./pages/Customer/Profile/Profile";


function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />


            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/my-garage" element={<MyGarage />} />
            <Route path="/customer/my-garage/add" element={<AddVehicle />} />
            <Route path="/customer/my-garage/:id" element={<VehicleDetails />} />
            <Route path="/customer/service-history" element={<ServiceHistory />} />
            <Route path="/customer/service-booking" element={<ServiceBooking />} />
            <Route path="/customer/profile" element={<Profile />} />

            {/* TODO: ADD OTHER ROUTES */}
            {/* DEFAULT ROUTE 404 ROUTE */}
            <Route path="*" element={<h1>404</h1>} />
        </Routes>
    );
}

export default Router;