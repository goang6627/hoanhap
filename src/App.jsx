import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";

/**
 * App — Root application component
 *
 * Architecture:
 *  AccessibilityProvider (global state)
 *    └─ AuthProvider (user session management)
 *        └─ BrowserRouter
 *            └─ Routes
 *                └─ MainLayout (sidebar + header + footer shell)
 *                    ├─ / → HomePage
 *                    ├─ /dang-nhap → LoginPage
 *                    ├─ /dang-ky → RegisterPage
 *                    ├─ /quen-mat-khau → ForgotPasswordPage
 *                    └─ /ho-so → ProfilePage
 */
export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/dang-nhap" element={<LoginPage />} />
              <Route path="/dang-ky" element={<RegisterPage />} />
              <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
              <Route path="/ho-so" element={<ProfilePage />} />

              {/* ── Phase 3: Core Modules ── */}
              {/* <Route path="/quyen-loi" element={<BenefitLookupPage />} /> */}
              {/* <Route path="/ket-noi" element={<CommunityPage />} /> */}
              {/* <Route path="/ban-do" element={<SupportMapPage />} /> */}
              {/* <Route path="/tin-tuc" element={<NewsPage />} /> */}

              {/* ── Phase 5: Admin ── */}
              {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
