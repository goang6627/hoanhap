import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";

const DISABILITY_OPTIONS = [
  { value: "không khuyết tật", label: "Không khuyết tật" },
  { value: "trực quan", label: "Khuyết tật trực quan (Khiếm thị)" },
  { value: "thính giác", label: "Khuyết tật thính giác (Khiếm thính / Câm điếc)" },
  { value: "vận động", label: "Khuyết tật vận động (Khó di chuyển)" },
  { value: "trí tuệ", label: "Khuyết tật trí tuệ hoặc học tập" },
  { value: "tâm thần", label: "Khuyết tật tâm thần / tự kỷ" },
  { value: "khác", label: "Loại khuyết tật khác" },
];

const VIETNAM_PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Lâm Đồng",
  "Quảng Nam",
  "Bình Dương",
  "Đồng Nai",
  "Thừa Thiên Huế",
  "Khánh Hòa",
  "Nghệ An",
  "Thanh Hóa",
  "Tây Ninh",
  "Bến Tre",
  "Tiền Giang",
  "Quảng Ninh",
  "Khác",
].sort((a, b) => a.localeCompare(b, "vi"));

export default function RegisterPage() {
  const { register, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    disabilityType: "không khuyết tật",
    region: "",
    needs: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Vui lòng nhập Họ và tên.";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Vui lòng nhập Email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Định dạng Email không hợp lệ (Ví dụ: ten@domain.com).";
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      errors.phone = "Số điện thoại phải từ 10 đến 11 chữ số.";
    }

    if (!formData.password) {
      errors.password = "Vui lòng nhập Mật khẩu.";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Vui lòng Nhập lại mật khẩu.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu nhập lại không khớp.";
    }

    if (!formData.region) {
      errors.region = "Vui lòng chọn Tỉnh / Thành phố sinh sống.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    
    // Clear validation error when typing
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setLiveMessage("Đăng ký không thành công. Hãy kiểm tra các thông tin bị lỗi.");
      return;
    }

    try {
      await register(formData);
      navigate("/ho-so", { replace: true });
    } catch (err) {
      setLiveMessage(err.message || "Đăng ký thất bại.");
    }
  };

  // Announce errors to screen reader
  useEffect(() => {
    const errorCount = Object.keys(formErrors).filter((k) => formErrors[k]).length;
    if (errorCount > 0) {
      setLiveMessage(`Có ${errorCount} lỗi trong biểu mẫu đăng ký cần chỉnh sửa.`);
    }
  }, [formErrors]);

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest dark:bg-tertiary/20 min-h-[calc(100vh-200px)]">
      {/* Dynamic Screen Reader Announcement Region */}
      <div className="sr-only" aria-live="assertive">
        {liveMessage}
      </div>

      <div className="w-full max-w-2xl space-y-8 bg-surface dark:bg-tertiary border-2 border-outline-variant dark:border-outline rounded-2xl p-6 md:p-10 shadow-lg theme-transition">
        <div>
          <h1 className="text-center font-bold text-headline-lg text-primary dark:text-inverse-primary">
            Đăng ký tài khoản
          </h1>
          <p className="mt-2 text-center text-body-medium text-on-surface-variant dark:text-tertiary-fixed-dim">
            Tham gia cộng đồng Hoà Nhập để nhận thông tin hỗ trợ và quyền lợi cá nhân hóa
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* GROUP 1: THÔNG TIN TÀI KHOẢN (ACCOUNT INFO) */}
          <fieldset className="border border-outline-variant dark:border-outline p-5 rounded-xl space-y-5">
            <legend className="px-2 text-label-large font-bold text-primary dark:text-inverse-primary flex items-center gap-2">
              <Icon name="account_circle" size="text-lg" />
              Thông tin tài khoản chính
            </legend>

            {/* Họ và tên */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed"
              >
                Họ và tên <span className="text-error" aria-hidden="true">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                aria-invalid={!!formErrors.fullName}
                aria-describedby={formErrors.fullName ? "fullName-error" : undefined}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container
                  ${
                    formErrors.fullName
                      ? "border-error focus:border-error focus:ring-error/20"
                      : "border-outline-variant dark:border-outline focus:border-primary"
                  }`}
                placeholder="Ví dụ: Nguyễn Văn An"
              />
              {formErrors.fullName && (
                <p id="fullName-error" className="text-sm font-semibold text-error flex items-center gap-1.5">
                  <Icon name="error" size="text-base" />
                  {formErrors.fullName}
                </p>
              )}
            </div>

            {/* Email & Số điện thoại Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed"
                >
                  Email <span className="text-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? "email-error" : undefined}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container
                    ${
                      formErrors.email
                        ? "border-error focus:border-error focus:ring-error/20"
                        : "border-outline-variant dark:border-outline focus:border-primary"
                    }`}
                  placeholder="name@domain.com"
                />
                {formErrors.email && (
                  <p id="email-error" className="text-sm font-semibold text-error flex items-center gap-1.5">
                    <Icon name="error" size="text-base" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed"
                >
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={!!formErrors.phone}
                  aria-describedby={formErrors.phone ? "phone-error" : undefined}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container
                    ${
                      formErrors.phone
                        ? "border-error focus:border-error focus:ring-error/20"
                        : "border-outline-variant dark:border-outline focus:border-primary"
                    }`}
                  placeholder="Ví dụ: 0912345678"
                />
                {formErrors.phone && (
                  <p id="phone-error" className="text-sm font-semibold text-error flex items-center gap-1.5">
                    <Icon name="error" size="text-base" />
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Mật khẩu & Xác nhận mật khẩu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mật khẩu */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed"
                >
                  Mật khẩu <span className="text-error" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
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
                    placeholder="Mật khẩu (ít nhất 6 ký tự)"
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
                  <p id="password-error" className="text-sm font-semibold text-error flex items-center gap-1.5">
                    <Icon name="error" size="text-base" />
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed"
                >
                  Nhập lại mật khẩu <span className="text-error" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-invalid={!!formErrors.confirmPassword}
                    aria-describedby={formErrors.confirmPassword ? "confirmPassword-error" : undefined}
                    className={`w-full pl-4 pr-12 py-3 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container
                      ${
                        formErrors.confirmPassword
                          ? "border-error focus:border-error focus:ring-error/20"
                          : "border-outline-variant dark:border-outline focus:border-primary"
                      }`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Ẩn xác nhận mật khẩu" : "Hiện xác nhận mật khẩu"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-surface-variant/50 focus-visible:ring-2 focus-visible:ring-primary text-on-surface-variant dark:text-tertiary-fixed-dim"
                  >
                    <Icon name={showConfirmPassword ? "visibility_off" : "visibility"} size="text-xl" />
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm font-semibold text-error flex items-center gap-1.5">
                    <Icon name="error" size="text-base" />
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* GROUP 2: HỒ SƠ PHÙ HỢP TIẾP CẬN (ACCESSIBILITY & LOCALIZATION DETAILS) */}
          <fieldset className="border border-outline-variant dark:border-outline p-5 rounded-xl space-y-5">
            <legend className="px-2 text-label-large font-bold text-primary dark:text-inverse-primary flex items-center gap-2">
              <Icon name="accessibility_new" size="text-lg" />
              Hồ sơ cá nhân hóa (Phổ Nghi)
            </legend>

            {/* Disability Type Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="disabilityType"
                className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed"
              >
                Nhóm đối tượng / Loại khuyết tật
              </label>
              <div className="relative">
                <select
                  id="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container appearance-none cursor-pointer"
                >
                  {DISABILITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant dark:text-tertiary-fixed-dim">
                  <Icon name="arrow_drop_down" size="text-2xl" />
                </div>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim">
                Thông tin này giúp lọc và đề xuất các chính sách, trợ cấp xã hội phù hợp nhất với bạn.
              </p>
            </div>

            {/* Region Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="region"
                className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed"
              >
                Tỉnh / Thành phố sinh sống <span className="text-error" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <select
                  id="region"
                  value={formData.region}
                  onChange={handleChange}
                  aria-invalid={!!formErrors.region}
                  aria-describedby={formErrors.region ? "region-error" : undefined}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container appearance-none cursor-pointer
                    ${
                      formErrors.region
                        ? "border-error focus:border-error focus:ring-error/20"
                        : "border-outline-variant dark:border-outline focus:border-primary"
                    }`}
                >
                  <option value="">-- Chọn Tỉnh / Thành phố --</option>
                  {VIETNAM_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant dark:text-tertiary-fixed-dim">
                  <Icon name="arrow_drop_down" size="text-2xl" />
                </div>
              </div>
              {formErrors.region && (
                <p id="region-error" className="text-sm font-semibold text-error flex items-center gap-1.5">
                  <Icon name="error" size="text-base" />
                  {formErrors.region}
                </p>
              )}
            </div>

            {/* Special Needs Textarea */}
            <div className="space-y-2">
              <label
                htmlFor="needs"
                className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed"
              >
                Nhu cầu hỗ trợ đặc biệt (nếu có)
              </label>
              <textarea
                id="needs"
                rows="3"
                value={formData.needs}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-4 focus:ring-primary-container"
                placeholder="Ví dụ: Cần hỗ trợ xe lăn, cần thông dịch ngôn ngữ ký hiệu, cần ứng dụng đọc màn hình bằng âm thanh,..."
              />
            </div>
          </fieldset>

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
                Đang tạo tài khoản...
              </span>
            ) : (
              "Đăng ký tài khoản"
            )}
          </Button>
        </form>

        {/* Link to Login */}
        <div className="pt-4 border-t border-outline-variant/50 text-center">
          <p className="text-sm text-on-surface-variant dark:text-tertiary-fixed-dim">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/dang-nhap"
              className="font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md px-1"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
