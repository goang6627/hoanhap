import Icon from "../ui/Icon";

const GUIDE_AUDIENCES = [
  "Dành cho người khuyết tật cần tra cứu nhanh quyền lợi và dịch vụ.",
  "Dành cho người thân muốn hỗ trợ tìm thông tin chính xác hơn.",
  "Dành cho cán bộ hỗ trợ khi hướng dẫn người dân sử dụng cổng thông tin.",
];

const videoConfig = {
  src: "",
  poster: "/videos/guide-poster.jpg",
  captions: "/captions/guide.vi.vtt",
  title: "Video hướng dẫn nhanh",
  description:
    "Tìm hiểu cách tra cứu dịch vụ, chính sách và sử dụng các công cụ hỗ trợ trên Hoà Nhập.",
  transcript:
    "Bản mô tả sẽ được bổ sung cùng video chính thức để hỗ trợ người dùng không xem hoặc không nghe được nội dung video.",
};

export default function GuideVideoSection() {
  const hasGuideVideo = Boolean(videoConfig.src);

  return (
    <section
      aria-labelledby="guide-video-title"
      className="px-margin-mobile md:px-margin-desktop py-14 md:py-20 bg-surface-container-lowest dark:bg-[#111318] theme-transition"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-center">
        <div className="space-y-5">
          <p className="text-sm font-bold uppercase tracking-wide text-primary dark:text-inverse-primary">
            Hướng dẫn sử dụng
          </p>
          <div className="space-y-3">
            <h2
              id="guide-video-title"
              className="text-headline-lg-mobile md:text-headline-lg font-extrabold text-on-surface dark:text-inverse-on-surface"
            >
              {videoConfig.title}
            </h2>
            <p className="text-body-md text-on-surface-variant dark:text-surface-dim max-w-2xl">
              {videoConfig.description}
            </p>
          </div>

          <ul className="space-y-3" aria-label="Nhóm người dùng được hỗ trợ">
            {GUIDE_AUDIENCES.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm md:text-base text-on-surface-variant dark:text-surface-dim"
              >
                <Icon
                  name="check_circle"
                  size="text-xl"
                  className="text-primary dark:text-inverse-primary mt-0.5 shrink-0"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {hasGuideVideo ? (
            <video
              className="aspect-video w-full rounded-2xl border-2 border-outline-variant/70 dark:border-outline bg-black shadow-xl theme-transition"
              controls
              preload="metadata"
              poster={videoConfig.poster}
              aria-describedby="guide-video-transcript"
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
              <div className="h-full flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-primary-fixed via-surface-container-lowest to-secondary-fixed/60 dark:from-tertiary dark:via-[#151923] dark:to-primary-container/40">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg mb-5"
                  aria-hidden="true"
                >
                  <Icon name="play_arrow" filled size="text-4xl md:text-5xl" />
                </div>
                <p className="text-lg md:text-xl font-extrabold text-on-surface dark:text-inverse-on-surface">
                  Video hướng dẫn sẽ được cập nhật sau
                </p>
                <p className="mt-2 max-w-md text-sm md:text-base text-on-surface-variant dark:text-surface-dim">
                  Khi có video thật, khu vực này sẽ hỗ trợ điều khiển phát, phụ đề và bản mô tả nội dung.
                </p>
              </div>
            </div>
          )}

          <div
            id="guide-video-transcript"
            className="rounded-xl border border-outline-variant/70 dark:border-outline bg-surface-container-low dark:bg-tertiary p-4 theme-transition"
          >
            <h3 className="font-bold text-base text-on-surface dark:text-inverse-on-surface">
              Bản mô tả nội dung video
            </h3>
            <p className="mt-2 text-sm text-on-surface-variant dark:text-surface-dim">
              {videoConfig.transcript}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
