import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ScrimmageListPage from "./pages/ScrimmageListPage";
import ScrimmageDetailPage from "./pages/ScrimmageDetailPage";
import CreateScrimmagePage from "./pages/CreateScrimmagePage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import MessagesPage from "./pages/MessagesPage";
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext.jsx";

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-gray-950 pb-12 sm:pb-0">
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/scrimmages" element={<ScrimmageListPage />} />
          <Route path="/scrimmages/new" element={<CreateScrimmagePage />} />
          <Route path="/scrimmages/:id" element={<ScrimmageDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
