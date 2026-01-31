import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Unlock from "./pages/Unlock";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedAdmin from "./components/ProtectedAdmin";
import SocialBar from "./components/SocialBar";
import ForcedAdModal from "./components/ForcedAdModal";

export default function App() {
  return (
    <BrowserRouter>
      <ForcedAdModal />
      <SocialBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:slug" element={<Unlock />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
