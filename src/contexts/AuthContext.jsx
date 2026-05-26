import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAccessibility } from "./AccessibilityContext";

/* ═══════════════════════════════════════════════════════════════════
   AuthContext
   ───────────────────────────────────────────────────────────────────
   Handles client-side authentication and session management.
   Persists users to local storage for realistic page-refresh behaviors.
   
   Integrates with AccessibilityContext for audio announcements of
   auth events (login, logout, errors).
   ═══════════════════════════════════════════════════════════════════ */

const AuthContext = createContext(null);

const ACTIVE_USER_KEY = "hoa-nhap-active-user";
const REGISTERED_USERS_KEY = "hoa-nhap-registered-users";

// Pre-populate with a mock test user if none exists
const defaultUsers = [
  {
    fullName: "Nguyễn Văn A",
    email: "test@hoanhap.vn",
    phone: "0912345678",
    password: "Password123",
    disabilityType: "trực quan",
    region: "Hà Nội",
    needs: "Cần hỗ trợ các tài liệu âm thanh và giao diện giọng nói.",
    savedBenefits: ["benefit-1", "benefit-3"],
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { speakText } = useAccessibility();

  // Initialize registered users database and load active user session
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
      if (!storedUsers) {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(defaultUsers));
      }

      const activeUser = localStorage.getItem(ACTIVE_USER_KEY);
      if (activeUser) {
        setUser(JSON.parse(activeUser));
      }
    } catch (err) {
      console.error("[AuthContext] Initialization failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to fetch current registered users from localStorage
  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      return stored ? JSON.parse(stored) : defaultUsers;
    } catch (err) {
      return defaultUsers;
    }
  };

  // ── Login ────────────────────────────────────────────────────────
  const login = useCallback(async (emailOrPhone, password) => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = getRegisteredUsers();
    const matchedUser = users.find(
      (u) =>
        (u.email === emailOrPhone || u.phone === emailOrPhone) &&
        u.password === password
    );

    if (matchedUser) {
      const sessionUser = { ...matchedUser };
      delete sessionUser.password; // Don't store plain text password in active session state

      setUser(sessionUser);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(sessionUser));
      setLoading(false);
      speakText(`Đăng nhập thành công. Chào mừng ${sessionUser.fullName} trở lại.`);
      return sessionUser;
    } else {
      const errMsg = "Tên đăng nhập hoặc mật khẩu không chính xác.";
      setError(errMsg);
      setLoading(false);
      speakText(`Lỗi đăng nhập: ${errMsg}`);
      throw new Error(errMsg);
    }
  }, [speakText]);

  // ── Register ─────────────────────────────────────────────────────
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getRegisteredUsers();
    
    // Check duplicates
    if (users.some((u) => u.email === userData.email)) {
      const errMsg = "Email này đã được sử dụng.";
      setError(errMsg);
      setLoading(false);
      speakText(errMsg);
      throw new Error(errMsg);
    }
    if (userData.phone && users.some((u) => u.phone === userData.phone)) {
      const errMsg = "Số điện thoại này đã được đăng ký.";
      setError(errMsg);
      setLoading(false);
      speakText(errMsg);
      throw new Error(errMsg);
    }

    const newUser = {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone || "",
      password: userData.password,
      disabilityType: userData.disabilityType || "không khuyết tật",
      region: userData.region || "",
      needs: userData.needs || "",
      savedBenefits: [],
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));

    // Log the user in directly after registering
    const sessionUser = { ...newUser };
    delete sessionUser.password;

    setUser(sessionUser);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(sessionUser));
    setLoading(false);
    speakText(`Đăng ký tài khoản thành công. Đã tự động đăng nhập làm ${sessionUser.fullName}.`);
    return sessionUser;
  }, [speakText]);

  // ── Logout ───────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
    speakText("Đã đăng xuất khỏi hệ thống.");
  }, [speakText]);

  // ── Update Profile ───────────────────────────────────────────────
  const updateProfile = useCallback(async (updatedData) => {
    if (!user) return;
    setLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getRegisteredUsers();
    
    // Find index of current user in registered list
    const userIndex = users.findIndex((u) => u.email === user.email);
    
    if (userIndex !== -1) {
      const currentFullRecord = users[userIndex];
      const updatedRecord = {
        ...currentFullRecord,
        ...updatedData,
        // Keep primary keys and password secure
        email: currentFullRecord.email, 
        password: currentFullRecord.password, 
      };

      users[userIndex] = updatedRecord;
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

      const updatedSessionUser = { ...updatedRecord };
      delete updatedSessionUser.password;

      setUser(updatedSessionUser);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updatedSessionUser));
      setLoading(false);
      speakText("Cập nhật hồ sơ cá nhân thành công.");
      return updatedSessionUser;
    } else {
      const errMsg = "Không tìm thấy hồ sơ người dùng để cập nhật.";
      setError(errMsg);
      setLoading(false);
      speakText(errMsg);
      throw new Error(errMsg);
    }
  }, [user, speakText]);

  // ── Toggle Saved Policy / Bookmark ────────────────────────────────
  const toggleSaveBenefit = useCallback(async (benefitId) => {
    if (!user) {
      speakText("Vui lòng đăng nhập để lưu quyền lợi này.");
      throw new Error("Authentication required");
    }

    const currentSaved = user.savedBenefits || [];
    let nextSaved = [];
    let isSaved = false;

    if (currentSaved.includes(benefitId)) {
      nextSaved = currentSaved.filter((id) => id !== benefitId);
      speakText("Đã bỏ lưu quyền lợi.");
    } else {
      nextSaved = [...currentSaved, benefitId];
      isSaved = true;
      speakText("Đã lưu quyền lợi vào hồ sơ cá nhân.");
    }

    await updateProfile({ savedBenefits: nextSaved });
    return isSaved;
  }, [user, updateProfile, speakText]);

  // ── Reset Password ───────────────────────────────────────────────
  const resetPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = getRegisteredUsers();
    const exists = users.some((u) => u.email === email);

    if (exists) {
      setLoading(false);
      speakText("Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email.");
      return true;
    } else {
      const errMsg = "Email này chưa được đăng ký trong hệ thống.";
      setError(errMsg);
      setLoading(false);
      speakText(errMsg);
      throw new Error(errMsg);
    }
  }, [speakText]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    toggleSaveBenefit,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
