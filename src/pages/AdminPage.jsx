import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { useAccessibility } from "../contexts/AccessibilityContext";

export default function AdminPage() {
  const { user } = useAuth();
  const { speakText } = useAccessibility();

  // Redirect if not logged in as Admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Dashboard counters (simulate mock stats + counts)
  const [visitorCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [allowanceRate, setAllowanceRate] = useState(360000);

  // Form states
  const [rateInput, setRateInput] = useState("360000");

  // Load data from localStorage
  useEffect(() => {
    // 1. Load users
    const storedUsers = localStorage.getItem("hoa-nhap-registered-users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    // 2. Load base rate
    const savedRate = localStorage.getItem("allowance-base-rate");
    if (savedRate) {
      setAllowanceRate(parseInt(savedRate, 10));
      setRateInput(savedRate);
    } else {
      localStorage.setItem("allowance-base-rate", "360000");
    }
  }, []);

  // Update Allowance Rate
  const handleUpdateRate = (e) => {
    e.preventDefault();
    const rateVal = parseInt(rateInput, 10);
    if (isNaN(rateVal) || rateVal <= 0) {
      speakText("Lỗi: Mức chuẩn trợ cấp không hợp lệ.");
      alert("Mức chuẩn trợ cấp phải là số dương.");
      return;
    }

    localStorage.setItem("allowance-base-rate", rateInput);
    setAllowanceRate(rateVal);
    // Dispatch storage event so calculator on another tab updates in real-time
    window.dispatchEvent(new Event("storage"));
    speakText(`Đã cập nhật mức chuẩn trợ cấp xã hội thành ${rateVal.toLocaleString("vi-VN")} đồng.`);
    alert("Cập nhật mức trợ cấp chuẩn thành công!");
  };

  // Toggle user status (Active vs Suspended)
  const toggleUserStatus = (email) => {
    const updated = users.map((u) => {
      if (u.email === email) {
        const nextStatus = u.status === "suspended" ? "active" : "suspended";
        speakText(`Đã thay đổi trạng thái của tài khoản ${u.fullName} thành ${nextStatus === "suspended" ? "Bị khoá" : "Đang hoạt động"}`);
        return { ...u, status: nextStatus };
      }
      return u;
    });

    setUsers(updated);
    localStorage.setItem("hoa-nhap-registered-users", JSON.stringify(updated));
  };

  return (
    <div className="flex-1 bg-surface-container-lowest dark:bg-tertiary/20 theme-transition pb-24 animate-[fadeIn_0.2s_ease-out]">
      {/* ─── Header Section ─── */}
      <section className="relative w-full bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed border-b-2 border-primary-container p-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl mb-2 flex items-center gap-2">
              <Icon name="admin_panel_settings" size="text-4xl" />
              Bảng quản trị hệ thống
            </h1>
            <p className="text-sm opacity-90">
              Quản lý tài khoản người dùng và thay đổi các cấu hình hệ thống trợ cấp xã hội.
            </p>
          </div>
          <span className="bg-primary-container text-on-primary-container dark:bg-on-primary-fixed-variant dark:text-primary-fixed text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Quyền: Quản trị viên
          </span>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-gutter grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* ─── Dashboard Cards (Span all columns) ─── */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Visitors */}
          <div className="bg-surface-container dark:bg-tertiary border-2 border-outline-variant dark:border-outline rounded-2xl p-6 theme-transition shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-on-surface-variant dark:text-tertiary-fixed-dim uppercase">Lượt truy cập hệ thống</span>
              <Icon name="monitoring" className="text-primary" />
            </div>
            <div className="text-3xl font-extrabold text-on-surface dark:text-inverse-on-surface">
              {visitorCount.toLocaleString()}
            </div>
          </div>

          {/* Card 2: Total Users */}
          <div className="bg-surface-container dark:bg-tertiary border-2 border-outline-variant dark:border-outline rounded-2xl p-6 theme-transition shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-on-surface-variant dark:text-tertiary-fixed-dim uppercase">Tổng số người dùng</span>
              <Icon name="group" className="text-primary" />
            </div>
            <div className="text-3xl font-extrabold text-on-surface dark:text-inverse-on-surface">
              {users.length}
            </div>
          </div>

          {/* Card 3: Base Allowance Rate */}
          <div className="bg-surface-container dark:bg-tertiary border-2 border-outline-variant dark:border-outline rounded-2xl p-6 theme-transition shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-on-surface-variant dark:text-tertiary-fixed-dim uppercase">Chuẩn trợ cấp (NĐ 20)</span>
              <Icon name="payments" className="text-primary" />
            </div>
            <div className="text-3xl font-extrabold text-on-surface dark:text-inverse-on-surface">
              {allowanceRate.toLocaleString()} <span className="text-sm font-normal">đ</span>
            </div>
          </div>
        </div>

        {/* ─── Cột trái: Quản lý mức trợ cấp ─── */}
        <div className="lg:col-span-1 space-y-10">
          {/* Section: Allowance Rate Manager */}
          <div className="bg-surface-container dark:bg-tertiary border-2 border-outline-variant dark:border-outline rounded-3xl p-6 shadow-sm theme-transition">
            <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-4 flex items-center gap-2">
              <Icon name="tune" className="text-primary" />
              Chuẩn trợ cấp xã hội
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim mb-6 leading-relaxed">
              Mức chuẩn này được dùng làm căn cứ nhân hệ số cho công cụ tính toán tự động tại trang Trợ cấp.
            </p>

            <form onSubmit={handleUpdateRate} className="space-y-4">
              <div>
                <label htmlFor="base-rate-input" className="block text-xs font-bold text-on-surface dark:text-inverse-on-surface mb-2">
                  Mức chuẩn trợ cấp (VND)
                </label>
                <input
                  type="number"
                  id="base-rate-input"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="w-full bg-surface-container-high dark:bg-tertiary-container border border-outline rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent theme-transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-sm flex items-center justify-center gap-2 accessibility-focus active:scale-95 text-xs"
              >
                Cập nhật cấu hình
              </button>
            </form>
          </div>
        </div>

        {/* ─── Cột phải: Quản lý người dùng ─── */}
        <div className="lg:col-span-2 space-y-10">
          {/* Section: User Manager Table */}
          <div className="bg-surface-container dark:bg-tertiary border-2 border-outline-variant dark:border-outline rounded-3xl p-6 shadow-sm theme-transition">
            <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-4 flex items-center gap-2">
              <Icon name="manage_accounts" className="text-primary" />
              Danh sách thành viên đăng ký
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-tertiary-fixed-dim mb-6">
              Hiển thị thông tin người dùng hệ thống. Bạn có thể khóa tài khoản nếu cần thiết.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" role="table">
                <thead>
                  <tr className="border-b border-outline-variant/60" role="row">
                    <th className="pb-3 font-bold text-on-surface-variant/70 uppercase" role="columnheader">Họ tên / Email</th>
                    <th className="pb-3 font-bold text-on-surface-variant/70 uppercase text-center" role="columnheader">Quyền hạn</th>
                    <th className="pb-3 font-bold text-on-surface-variant/70 uppercase text-center" role="columnheader">Trạng thái</th>
                    <th className="pb-3 font-bold text-on-surface-variant/70 uppercase text-right" role="columnheader">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.email} className="border-b border-outline-variant/30 last:border-b-0" role="row">
                      <td className="py-3 pr-2" role="cell">
                        <div className="font-bold text-on-surface dark:text-inverse-on-surface">{u.fullName}</div>
                        <div className="text-[10px] text-on-surface-variant dark:text-tertiary-fixed-dim mt-0.5">{u.email}</div>
                      </td>
                      <td className="py-3 text-center" role="cell">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          u.role === "admin"
                            ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                            : "bg-surface-variant text-on-surface-variant"
                        }`}>
                          {u.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-3 text-center" role="cell">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          u.status === "suspended"
                            ? "bg-error-container text-on-error-container"
                            : "bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300"
                        }`}>
                          {u.status === "suspended" ? "Bị khóa" : "Hoạt động"}
                        </span>
                      </td>
                      <td className="py-3 text-right" role="cell">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => toggleUserStatus(u.email)}
                            aria-label={u.status === "suspended" ? `Mở khoá tài khoản ${u.fullName}` : `Khóa tài khoản ${u.fullName}`}
                            className={`p-1.5 rounded-lg border transition-colors accessibility-focus ${
                              u.status === "suspended"
                                ? "border-teal-500 text-teal-600 hover:bg-teal-50"
                                : "border-error text-error hover:bg-error-container/10"
                            }`}
                          >
                            <Icon name={u.status === "suspended" ? "check" : "block"} size="text-sm" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
