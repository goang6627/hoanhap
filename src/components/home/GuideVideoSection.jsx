import { useRef, useState } from "react";

const GUIDE_AUDIENCES = [
  "Dành cho người khuyết tật cần tra cứu nhanh quyền lợi và dịch vụ.",
  "Dành cho người thân muốn hỗ trợ tìm thông tin chính xác hơn.",
  "Dành cho cán bộ hỗ trợ khi hướng dẫn người dân sử dụng cổng thông tin.",
];

const videoConfig = {
  src: "/videos/guide.mp4",
  poster:
    "https://images.pexels.com/photos/7162980/pexels-photo-7162980.jpeg?auto=compress&cs=tinysrgb&w=1200",
  captions: "/captions/guide.vi.vtt",
  placeholderImage:
    "https://images.pexels.com/photos/7162980/pexels-photo-7162980.jpeg?auto=compress&cs=tinysrgb&w=1200",
  title: "Video giới thiệu Hoà Nhập",
  description:
    "Tìm hiểu tổng quan về Hoà Nhập, các tính năng tra cứu quyền lợi, trợ cấp xã hội, bản đồ hỗ trợ, kết nối cộng đồng và công cụ trợ năng.",
};

export default function GuideVideoSection() {
  const hasGuideVideo = Boolean(videoConfig.src);
  const videoRef = useRef(null);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);

  const toggleCaptions = () => {
    const nextEnabled = !captionsEnabled;
    const tracks = videoRef.current?.textTracks;

    if (tracks?.length) {
      Array.from(tracks).forEach((track) => {
        if (track.kind === "captions") {
          track.mode = nextEnabled ? "showing" : "disabled";
        }
      });
    }

    setCaptionsEnabled(nextEnabled);
  };

  return (
    <section
      aria-labelledby="guide-video-title"
      className="px-margin-mobile md:px-margin-desktop py-14 md:py-20 bg-surface-container-lowest dark:bg-[#111318] theme-transition"
    >
      <div className="max-w-[1440px] mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.18fr_0.82fr] gap-8 lg:gap-12 items-start">
          <div className="space-y-3">
            {hasGuideVideo ? (
              <video
                ref={videoRef}
                className="aspect-video w-full rounded-2xl border-2 border-outline-variant/70 dark:border-outline bg-black shadow-xl theme-transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-primary focus-visible:outline-offset-4"
                controls
                preload="metadata"
                poster={videoConfig.poster}
                aria-describedby="guide-video-summary"
              >
                <source src={videoConfig.src} type="video/mp4" />
                <track
                  kind="captions"
                  src={videoConfig.captions}
                  srcLang="vi"
                  label="Tiếng Việt"
                  default
                />
                Trình duyệt của bạn không hỗ trợ phát video HTML5.
              </video>
            ) : (
              <div
                className="aspect-video w-full rounded-2xl border-2 border-outline-variant/70 dark:border-outline bg-surface-container dark:bg-tertiary overflow-hidden shadow-xl theme-transition"
                role="img"
                aria-label="Khung video hướng dẫn nhanh. Video hướng dẫn sẽ được cập nhật sau."
              >
                <div className="relative h-full bg-surface-container-lowest dark:bg-[#151923]">
                  <img
                    src={videoConfig.placeholderImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-4 bottom-4 rounded-xl border border-outline-variant/70 dark:border-outline bg-surface-container-lowest/95 dark:bg-[#151923]/95 px-4 py-3 text-center shadow-lg">
                    <p className="text-base md:text-lg font-extrabold text-on-surface dark:text-inverse-on-surface">
                      Video hướng dẫn sẽ được cập nhật sau
                    </p>
                    <p className="mt-1 text-xs md:text-sm text-on-surface-variant dark:text-surface-dim">
                      Khi có video thật, khu vực này sẽ hỗ trợ điều khiển phát, phụ đề và bản mô tả nội dung.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-on-surface-variant dark:text-surface-dim">
                Video không tự động phát, có điều khiển phát và phụ đề tiếng Việt.
              </p>
              {hasGuideVideo && (
                <button
                  type="button"
                  onClick={toggleCaptions}
                  aria-pressed={captionsEnabled}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary/50 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary-fixed focus-visible:outline focus-visible:outline-4 focus-visible:outline-primary focus-visible:outline-offset-4 dark:border-inverse-primary/60 dark:text-inverse-primary dark:hover:bg-primary-container"
                >
                  {captionsEnabled ? "Tắt phụ đề" : "Bật phụ đề"}
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant/70 dark:border-outline bg-surface-container-lowest dark:bg-tertiary p-6 md:p-7 shadow-sm theme-transition">
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-wide text-primary dark:text-inverse-primary">
                Giới thiệu website
              </p>
              <h2
                id="guide-video-title"
                className="text-headline-lg-mobile md:text-headline-lg font-extrabold text-on-surface dark:text-inverse-on-surface"
              >
                {videoConfig.title}
              </h2>
              <p className="text-body-md text-on-surface-variant dark:text-surface-dim">
                {videoConfig.description}
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-primary-fixed/60 dark:bg-[#151923] p-4">
              <h3 className="font-bold text-base text-on-surface dark:text-inverse-on-surface">
                Phù hợp với người dùng
              </h3>
              <ul className="mt-3 space-y-2" aria-label="Nhóm người dùng được hỗ trợ">
                {GUIDE_AUDIENCES.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-on-surface-variant dark:text-surface-dim"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          id="guide-video-summary"
          className="rounded-2xl border border-outline-variant/70 dark:border-outline bg-surface-container-low dark:bg-tertiary p-5 md:p-6 theme-transition"
        >
          <h3 className="font-bold text-base text-on-surface dark:text-inverse-on-surface">
            Tóm tắt nội dung video
          </h3>
          <p className="mt-2 text-sm md:text-base text-on-surface-variant dark:text-surface-dim">
            Video giới thiệu Hoà Nhập là cổng thông tin hỗ trợ người khuyết tật tại Việt Nam,
            giúp người dùng tìm kiếm thông tin chính sách, quyền lợi, trợ cấp, địa điểm hỗ trợ
            và các công cụ trợ năng một cách rõ ràng, thuận tiện hơn.
          </p>
        </div>
      </div>
    </section>
  );
}
