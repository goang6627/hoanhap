import { useCallback } from "react";
import { useAccessibility } from "../contexts/AccessibilityContext";
import SearchBar from "../components/ui/SearchBar";
import ServiceCard from "../components/ui/ServiceCard";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";

/**
 * HomePage — Main landing page converted from code.html
 *
 * Sections:
 *  1. Hero with search bar
 *  2. Service grid (4 cards, bento style)
 *  3. CTA Banner (legal support)
 *
 * All content is in natural Vietnamese.
 * Uses semantic <section> elements with aria-labelledby.
 */

const SERVICES = [
  {
    to: "/quyen-loi",
    icon: "gavel",
    title: "Tra cứu quyền lợi",
    description:
      "Thông tin chi tiết về thủ tục hành chính, cấp giấy xác nhận và chính sách ưu đãi.",
    ariaLabel:
      "Tra cứu quyền lợi, thủ tục hành chính và chính sách",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
    iconBorder: "border-primary-container",
  },
  {
    to: "/ket-noi",
    icon: "diversity_3",
    title: "Kết nối yêu thương",
    description:
      "Kết nối bạn với các cộng đồng và cá nhân sẵn lòng hỗ trợ, chia sẻ cùng người khuyết tật.",
    ariaLabel:
      "Kết nối yêu thương và hỗ trợ từ cộng đồng",
    iconBg: "bg-error-container",
    iconColor: "text-on-error-container",
    iconBorder: "border-error",
  },
  {
    to: "/ban-do",
    icon: "map",
    title: "Bản đồ hỗ trợ",
    description:
      "Tìm kiếm cơ sở y tế, trung tâm phục hồi chức năng và địa điểm tiếp cận gần bạn.",
    ariaLabel:
      "Bản đồ hỗ trợ tìm kiếm cơ sở y tế, trung tâm gần nhất",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-on-secondary-fixed",
    iconBorder: "border-secondary",
  },
  {
    to: "/tin-tuc",
    icon: "article",
    title: "Tin tức & Bài viết",
    description:
      "Cập nhật các thông báo mới nhất từ chính phủ và các câu chuyện truyền cảm hứng.",
    ariaLabel:
      "Tin tức và Bài viết, cập nhật thông tin mới nhất",
    iconBg: "bg-surface-variant",
    iconColor: "text-on-surface-variant",
    iconBorder: "border-outline",
  },
];

export default function HomePage() {
  const { state, speakText } = useAccessibility();

  const handleSearch = useCallback(
    (query) => {
      // Phase 3 will implement actual search logic
      console.log("Search query:", query);
      if (state.screenReader) {
        speakText(`Đang tìm kiếm kết quả cho: ${query}`);
      }
    },
    [state.screenReader, speakText]
  );

  return (
    <>
      {/* ═══ Hero Section with Search ═══ */}
      <section
        aria-labelledby="hero-heading"
        className="w-full bg-primary-fixed dark:bg-on-primary-fixed
                   py-16 md:py-24
                   px-margin-mobile md:px-margin-desktop
                   relative overflow-hidden
                   flex flex-col items-center justify-center
                   border-b-2 border-primary
                   theme-transition"
      >
        <div className="max-w-[1000px] w-full mx-auto relative z-10 flex flex-col items-center text-center space-y-8">
          <h1
            id="hero-heading"
            className="text-headline-xl md:text-[3.5rem] md:leading-[4.25rem]
                       text-on-primary-fixed dark:text-primary-fixed
                       font-extrabold leading-tight max-w-3xl"
          >
            Hòa nhập và Phát triển cùng cộng đồng
          </h1>

          <p className="text-body-lg text-on-surface-variant dark:text-surface-variant max-w-2xl">
            Cổng thông tin hỗ trợ tiếp cận dịch vụ, chính sách và cơ hội việc
            làm dành cho người khuyết tật tại Việt Nam.
          </p>

          {/* Search Bar */}
          <div className="w-full mt-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Decorative background elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full
                     -translate-y-1/2 translate-x-1/3 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full
                     translate-y-1/2 -translate-x-1/3 blur-3xl"
          aria-hidden="true"
        />
      </section>

      {/* ═══ Service Grid (Bento Style) ═══ */}
      <section
        aria-labelledby="services-heading"
        className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop
                   max-w-[1440px] mx-auto w-full"
      >
        <h2
          id="services-heading"
          className="text-headline-lg-mobile md:text-headline-lg
                     text-on-surface dark:text-inverse-on-surface
                     mb-12 text-center md:text-left
                     border-b-4 border-primary dark:border-inverse-primary
                     inline-block pb-2"
        >
          Dịch vụ trọng tâm
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {SERVICES.map((service) => (
            <ServiceCard key={service.to} {...service} />
          ))}
        </div>
      </section>

      {/* ═══ Call to Action Banner ═══ */}
      <section
        aria-labelledby="cta-heading"
        className="py-12 px-margin-mobile md:px-margin-desktop w-full"
      >
        <div
          className="cta-banner max-w-[1440px] mx-auto
                     bg-primary dark:bg-primary-container
                     text-on-primary dark:text-on-primary-container
                     rounded-2xl p-8 md:p-12
                     flex flex-col md:flex-row items-center justify-between gap-8
                     border-4 border-primary-container dark:border-primary
                     shadow-xl theme-transition"
        >
          <div className="max-w-2xl text-center md:text-left">
            <h2
              id="cta-heading"
              className="text-headline-lg-mobile md:text-headline-lg font-bold mb-4"
            >
              Bạn cần hỗ trợ pháp lý trực tiếp?
            </h2>
            <p className="text-body-lg opacity-90">
              Đội ngũ chuyên gia luật của chúng tôi luôn sẵn sàng tư vấn miễn
              phí cho người khuyết tật và gia đình.
            </p>
          </div>

          <button
            className="bg-surface text-primary font-bold text-label-lg
                       px-8 py-4 rounded-xl
                       hover:bg-surface-variant transition-colors
                       min-h-[56px]
                       focus-visible:ring-4 focus-visible:ring-surface
                       border-2 border-surface whitespace-nowrap
                       shadow-lg
                       flex items-center gap-2
                       active:scale-95"
          >
            <Icon name="headset_mic" size="text-xl" />
            Liên hệ ngay
          </button>
        </div>
      </section>
    </>
  );
}
