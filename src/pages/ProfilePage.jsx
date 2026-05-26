import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

const MOCK_BENEFITS = [
  {
    id: "benefit-1",
    title: "Trợ cấp bảo trợ xã hội hàng tháng",
    description: "Nhận mức hỗ trợ trợ cấp sinh hoạt hàng tháng tùy theo mức độ khuyết tật nặng hay đặc biệt nặng từ 540.000 đến 1.440.000 VNĐ.",
    category: "Trợ cấp",
  },
  {
    id: "benefit-2",
    title: "Cấp thẻ Bảo hiểm Y tế miễn phí",
    description: "Người khuyết tật nặng và đặc biệt nặng được cấp thẻ BHYT miễn phí với mức hưởng 100% chi phí khám chữa bệnh tại cơ sở công lập.",
    category: "Y tế",
  },
  {
    id: "benefit-3",
    title: "Miễn giảm học phí & hỗ trợ chi phí học tập",
    description: "Miễn giảm học phí tại các cơ sở giáo dục công lập và nhận hỗ trợ chi phí học bổng, dụng cụ học tập hàng năm.",
    category: "Giáo dục",
  },
];

export default function ProfilePage() {
  const { user, loading, updateProfile, toggleSaveBenefit, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    disabilityType: "không khuyết tật",
    region: "",
    needs: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [liveMessage, setLiveMessage] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // Protected route logic: Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/dang-nhap", { replace: true, state: { from: { pathname: "/ho-so" } } });
    }
  }, [user, loading, navigate]);

  // Load user data into form on load or editing toggle
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        disabilityType: user.disabilityType || "không khuyết tật",
        region: user.region || "",
        needs: user.needs || "",
      });
    }
  }, [user, isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setLiveMessage("Đã bật chế độ chỉnh sửa thông tin cá nhân.");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormErrors({});
    setLiveMessage("Đã hủy bỏ các thay đổi.");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Họ và tên không được bỏ trống.";
    }
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      errors.phone = "Số điện thoại phải từ 10 đến 11 chữ số.";
    }
    if (!formData.region) {
      errors.region = "Vui lòng chọn Tỉnh / Thành phố.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setLiveMessage("Lưu hồ sơ thất bại. Có thông tin bị lỗi.");
      return;
    }

    setSaveLoading(true);
    setLiveMessage("Đang lưu hồ sơ...");
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setLiveMessage("Đã lưu thay đổi hồ sơ cá nhân thành công.");
    } catch (err) {
      setLiveMessage(err.message || "Lỗi lưu hồ sơ.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRemoveSaved = async (id, title) => {
    try {
      await toggleSaveBenefit(id);
      setLiveMessage(`Đã xóa "${title}" khỏi danh sách lưu trữ.`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-surface-container-lowest dark:bg-tertiary/20">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-lg font-semibold text-on-surface dark:text-inverse-on-surface">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  // Filter saved benefits from mock database
  const savedBenefitsList = MOCK_BENEFITS.filter((b) => user.savedBenefits?.includes(b.id));

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest dark:bg-tertiary/20 theme-transition">
      {/* Dynamic Screen Reader Announcement */}
      <div className="sr-only" aria-live="assertive">
        {liveMessage}
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface dark:bg-tertiary p-6 rounded-2xl border-2 border-outline-variant dark:border-outline shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-on-primary font-bold text-headline-md flex items-center justify-center shadow-md">
              {user.fullName ? user.fullName.split(" ").pop().charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="font-bold text-headline-md text-on-surface dark:text-inverse-on-surface">
                Hồ sơ cá nhân
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-tertiary-fixed-dim">
                Email: <span className="font-semibold">{user.email}</span>
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={logout}
            icon="logout"
            className="w-full md:w-auto"
          >
            Đăng xuất
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Middle Column: Information & Form */}
          <div className="lg:col-span-2 bg-surface dark:bg-tertiary rounded-2xl border-2 border-outline-variant dark:border-outline p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-outline-variant/50 pb-4">
              <h2 className="text-title-large font-bold text-primary dark:text-inverse-primary flex items-center gap-2">
                <Icon name="person" size="text-xl" />
                Thông tin cá nhân
              </h2>
              {!isEditing && (
                <Button variant="secondary" onClick={handleEditClick} icon="edit">
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-5">
                {/* Họ và tên */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed">
                    Họ và tên
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    aria-invalid={!!formErrors.fullName}
                    aria-describedby={formErrors.fullName ? "fullName-error" : undefined}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container
                      ${formErrors.fullName ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant dark:border-outline focus:border-primary"}`}
                  />
                  {formErrors.fullName && (
                    <p id="fullName-error" className="text-sm font-semibold text-error flex items-center gap-1.5">
                      <Icon name="error" size="text-base" />
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={!!formErrors.phone}
                    aria-describedby={formErrors.phone ? "phone-error" : undefined}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container
                      ${formErrors.phone ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant dark:border-outline focus:border-primary"}`}
                  />
                  {formErrors.phone && (
                    <p id="phone-error" className="text-sm font-semibold text-error flex items-center gap-1.5">
                      <Icon name="error" size="text-base" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Loại khuyết tật select */}
                <div className="space-y-2">
                  <label htmlFor="disabilityType" className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed">
                    Nhóm đối tượng / Loại khuyết tật
                  </label>
                  <div className="relative">
                    <select
                      id="disabilityType"
                      value={formData.disabilityType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container appearance-none cursor-pointer"
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
                </div>

                {/* Tỉnh thành */}
                <div className="space-y-2">
                  <label htmlFor="region" className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed">
                    Tỉnh / Thành phố sinh sống
                  </label>
                  <div className="relative">
                    <select
                      id="region"
                      value={formData.region}
                      onChange={handleChange}
                      aria-invalid={!!formErrors.region}
                      aria-describedby={formErrors.region ? "region-error" : undefined}
                      className={`w-full px-4 py-2.5 rounded-xl border-2 bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container appearance-none cursor-pointer
                        ${formErrors.region ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant dark:border-outline focus:border-primary"}`}
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

                {/* Nhu cầu hỗ trợ đặc biệt */}
                <div className="space-y-2">
                  <label htmlFor="needs" className="block text-sm font-bold text-on-surface dark:text-tertiary-fixed">
                    Nhu cầu hỗ trợ đặc biệt
                  </label>
                  <textarea
                    id="needs"
                    rows="3"
                    value={formData.needs}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-tertiary text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-4 focus:ring-primary-container"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-outline-variant/50">
                  <Button type="submit" variant="primary" disabled={saveLoading} className="flex-1">
                    {saveLoading ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCancelClick} className="flex-1">
                    Hủy
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-tertiary-fixed-dim">Họ và tên</h3>
                    <p className="text-body-lg font-bold text-on-surface dark:text-inverse-on-surface mt-1">{user.fullName}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-tertiary-fixed-dim">Số điện thoại</h3>
                    <p className="text-body-lg font-semibold text-on-surface dark:text-inverse-on-surface mt-1">
                      {user.phone || <em className="text-on-surface-variant/75 font-normal">Chưa cập nhật</em>}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-tertiary-fixed-dim">Nhóm khuyết tật</h3>
                    <p className="text-body-lg font-semibold text-on-surface dark:text-inverse-on-surface mt-1 capitalize">{user.disabilityType}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-tertiary-fixed-dim">Khu vực cư trú</h3>
                    <p className="text-body-lg font-semibold text-on-surface dark:text-inverse-on-surface mt-1">{user.region || <em className="text-on-surface-variant/75 font-normal">Chưa cập nhật</em>}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-tertiary-fixed-dim">Nhu cầu hỗ trợ đặc biệt</h3>
                  <p className="text-body-medium text-on-surface dark:text-inverse-on-surface mt-2 leading-relaxed bg-surface-container-lowest dark:bg-tertiary-container/30 p-4 rounded-xl border border-outline-variant/50">
                    {user.needs || <em className="text-on-surface-variant/75 font-normal">Không có yêu cầu hỗ trợ đặc biệt nào được ghi nhận.</em>}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Bookmarks / Saved Benefits */}
          <div id="saved" className="bg-surface dark:bg-tertiary rounded-2xl border-2 border-outline-variant dark:border-outline p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-title-large font-bold text-primary dark:text-inverse-primary flex items-center gap-2 border-b border-outline-variant/50 pb-4 mb-4">
                <Icon name="bookmark" size="text-xl" />
                Quyền lợi đã lưu
              </h2>

              {savedBenefitsList.length > 0 ? (
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  {savedBenefitsList.map((benefit) => (
                    <div
                      key={benefit.id}
                      className="p-4 bg-surface-container-low dark:bg-tertiary-container/30 border border-outline-variant dark:border-outline rounded-xl hover:border-primary transition-all duration-150 relative group"
                    >
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full">
                          {benefit.category}
                        </span>
                        <button
                          onClick={() => handleRemoveSaved(benefit.id, benefit.title)}
                          aria-label={`Bỏ lưu: ${benefit.title}`}
                          className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-error-container/10 focus-visible:ring-2 focus-visible:ring-error"
                        >
                          <Icon name="delete" size="text-lg" />
                        </button>
                      </div>
                      <h3 className="font-bold text-sm text-on-surface dark:text-inverse-on-surface line-clamp-1">
                        {benefit.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim leading-relaxed line-clamp-2 mt-1">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                    <Icon name="bookmark_border" size="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface dark:text-inverse-on-surface">Chưa lưu quyền lợi</h3>
                    <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim mt-1 max-w-[200px] leading-relaxed mx-auto">
                      Các chính sách bạn lưu trữ sẽ hiển thị tại đây để tra cứu nhanh.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-outline-variant/50">
              <Button
                variant="primary"
                onClick={() => navigate("/")}
                icon="search"
                className="w-full"
              >
                Tra cứu thêm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
