import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BetaBanner from "./components/BetaBanner";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ScrimmageListPage from "./pages/ScrimmageListPage";
import ScrimmageDetailPage from "./pages/ScrimmageDetailPage";
import CreateScrimmagePage from "./pages/CreateScrimmagePage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import EditScrimmagePage from "./pages/EditScrimmagePage";
import AboutPage from "./pages/AboutPage";
import SupportPage from "./pages/SupportPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import ToastContainer from "./components/ToastContainer";
import Footer from "./components/Footer";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

export default function App() {
    const { user, logout } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-white dark:bg-gray-950 pb-32 sm:pb-16 flex flex-col">
                <Navbar user={user} logout={logout} />
                <BetaBanner />
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/scrimmages" element={<ScrimmageListPage />} />
                    <Route path="/scrimmages/new" element={<CreateScrimmagePage />} />
                    <Route path="/scrimmages/:id" element={<ScrimmageDetailPage />} />
                    <Route path="/scrimmages/:id/edit" element={<EditScrimmagePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/friends" element={<FriendsPage />} />
                    <Route path="/users/:id" element={<UserProfilePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}
