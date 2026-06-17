import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";

export default function ForgotPasswordPage() {
  const { resetPassword, loading, error: authError } = useAuth();
  
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setSuccess(false);

    if (!email.trim()) {
      const err = "Vui lòng nhập Email của bạn.";
      setValidationError(err);
      setLiveMessage(err);
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const err = "Định dạng Email không hợp lệ (Ví dụ: ten@domain.com).";
      setValidationError(err);
      setLiveMessage(err);
      return;
    }

    try {
      await resetPassword(email.trim());
      setSuccess(true);
      setLiveMessage("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.");
    } catch (err) {
      setLiveMessage(err.message || "Không thể yêu cầu đặt lại mật khẩu.");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest dark:bg-tertiary/20 min-h-[calc(100vh-200px)]">
      {/* Dynamic Screen Reader Announcement Region */}
      <div className="sr-only" aria-live="assertive">
        {liveMessage}
      </div>

      <div className="w-full max-w-md space-y-8 bg-surface dark:bg-tertiary border-2 border-outline-variant dark:border-outline rounded-2xl p-6 md:p-10 shadow-lg theme-transition">
        <div>
          <h1 className="text-center font-bold text-headline-lg text-primary dark:text-inverse-primary">
            Quên mật khẩu?
          </h1>
          <p className="mt-2 text-center text-body-medium text-on-surface-variant dark:text-tertiary-fixed-dim">
            Nhập email tài khoản của bạn để nhận liên kết khôi phục mật khẩu
          </p>
        </div>

        {success ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-fixed text-on-primary-fixed">
              <Icon name="mark_email_read" size="text-3xl" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-on-surface dark:text-inverse-on-surface">
                Đã gửi email khôi phục!
              </h2>
              <p className="text-sm text-on-surface-variant dark:text-tertiary-fixed-dim leading-relaxed">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới hộp thư <strong className="text-on-surface dark:text-white">{email}</strong>. Hãy kiểm tra cả mục thư rác (spam) nếu không tìm thấy.
              </p>
            </div>
            <Link
              to="/dang-nhap"
              className="w-full inline-flex justify-center items-center gap-2 bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl hover:bg-primary-container hover:text-on-primary focus-visible:ring-4 focus-visible:ring-primary-container transition-all active:scale-95 shadow-sm"
            >
              <Icon name="arrow_back" size="text-xl" />
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Global Errors */}
            {authError && (
              <div
                className="flex items-start gap-3 p-4 bg-error-container text-on-error-container rounded-xl border border-error/20"
                role="alert"
              >
                <Icon name="error" size="text-xl" className="text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{authError}</p>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-label-large font-bold text-on-surface dark:text-tertiary-fixed"
              >
                Địa chỉ Email đã đăng ký
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError("");
                }}
                aria-invalid={!!validationError}
                aria-describedby={validationError ? "email-error" : undefined}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container
                  ${
                    validationError
                      ? "border-error focus:border-error focus:ring-error/20"
                      : "border-outline-variant dark:border-outline focus:border-primary"
                  }`}
                placeholder="ten@domain.com"
              />
              {validationError && (
                <p id="email-error" className="text-sm font-semibold text-error flex items-center gap-1.5">
                  <Icon name="error" size="text-base" />
                  {validationError}
                </p>
              )}
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
                  Đang gửi liên kết...
                </span>
              ) : (
                "Gửi liên kết khôi phục"
              )}
            </Button>

            {/* Back Link */}
            <div className="text-center">
              <Link
                to="/dang-nhap"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md px-1"
              >
                <Icon name="arrow_back" size="text-base" />
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
