import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";

export default function LoginPage() {
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  // Determine where to redirect after login (default is homepage)
  const from = location.state?.from?.pathname || "/";

  // Form validations
  const validateForm = () => {
    const errors = {};
    if (!formData.emailOrPhone.trim()) {
      errors.emailOrPhone = "Vui lòng nhập Email hoặc Số điện thoại.";
    }
    if (!formData.password) {
      errors.password = "Vui lòng nhập Mật khẩu.";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    
    // Clear validation error when typing
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setLiveMessage("Đăng nhập không thành công. Hãy kiểm tra các thông tin bị lỗi.");
      return;
    }

    try {
      await login(formData.emailOrPhone, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setLiveMessage(err.message || "Đăng nhập thất bại.");
    }
  };

  // Announce errors to screen reader
  useEffect(() => {
    const errorCount = Object.keys(formErrors).filter((k) => formErrors[k]).length;
    if (errorCount > 0) {
      setLiveMessage(`Có ${errorCount} lỗi trong biểu mẫu cần chỉnh sửa.`);
    }
  }, [formErrors]);

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest dark:bg-tertiary/20 min-h-[calc(100vh-200px)]">
      {/* Dynamic Screen Reader Announcement Region */}
      <div className="sr-only" aria-live="assertive">
        {liveMessage}
      </div>

      <div className="w-full max-w-md space-y-8 bg-surface dark:bg-tertiary border-2 border-outline-variant dark:border-outline rounded-2xl p-6 md:p-10 shadow-lg theme-transition">
        <div>
          <h1 className="text-center font-bold text-headline-lg text-primary dark:text-inverse-primary">
            Đăng nhập
          </h1>
          <p className="mt-2 text-center text-body-medium text-on-surface-variant dark:text-tertiary-fixed-dim">
            Truy cập cổng thông tin hỗ trợ người khuyết tật Hoà Nhập
          </p>
        </div>

        {/* Global authentication errors */}
        {authError && (
          <div
            className="flex items-start gap-3 p-4 bg-error-container text-on-error-container rounded-xl border border-error/20"
            role="alert"
          >
            <Icon name="error" size="text-xl" className="text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Phone Input */}
          <div className="space-y-2">
            <label
              htmlFor="emailOrPhone"
              className="block text-label-large font-bold text-on-surface dark:text-tertiary-fixed"
            >
              Email hoặc Số điện thoại
            </label>
            <input
              id="emailOrPhone"
              type="text"
              autoComplete="username"
              value={formData.emailOrPhone}
              onChange={handleChange}
              aria-invalid={!!formErrors.emailOrPhone}
              aria-describedby={formErrors.emailOrPhone ? "emailOrPhone-error" : undefined}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-4 focus:ring-primary-container
                ${
                  formErrors.emailOrPhone
                    ? "border-error focus:border-error focus:ring-error/20"
                    : "border-outline-variant dark:border-outline focus:border-primary"
                }`}
              placeholder="Ví dụ: email@domain.com hoặc 09123..."
            />
            {formErrors.emailOrPhone && (
              <p
                id="emailOrPhone-error"
                className="text-sm font-semibold text-error flex items-center gap-1.5"
              >
                <Icon name="error" size="text-base" />
                {formErrors.emailOrPhone}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-label-large font-bold text-on-surface dark:text-tertiary-fixed"
              >
                Mật khẩu
              </label>
              <Link
                to="/quen-mat-khau"
                className="text-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md px-1"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!formErrors.password}
                aria-describedby={formErrors.password ? "password-error" : undefined}
                className={`w-full pl-4 pr-12 py-3 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container
                  ${
                    formErrors.password
                      ? "border-error focus:border-error focus:ring-error/20"
                      : "border-outline-variant dark:border-outline focus:border-primary"
                  }`}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-surface-variant/50 focus-visible:ring-2 focus-visible:ring-primary text-on-surface-variant dark:text-tertiary-fixed-dim"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} size="text-xl" />
              </button>
            </div>
            {formErrors.password && (
              <p
                id="password-error"
                className="text-sm font-semibold text-error flex items-center gap-1.5"
              >
                <Icon name="error" size="text-base" />
                {formErrors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-5 h-5 rounded text-primary border-outline focus:ring-primary bg-surface-container-lowest"
            />
            <label
              htmlFor="rememberMe"
              className="ml-3 text-sm font-semibold text-on-surface-variant dark:text-tertiary-fixed-dim cursor-pointer select-none"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full flex justify-center py-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        {/* Link to Register */}
        <div className="pt-4 border-t border-outline-variant/50 text-center">
          <p className="text-sm text-on-surface-variant dark:text-tertiary-fixed-dim">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/dang-ky"
              className="font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md px-1"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
