const YOUTUBE_IFRAME_API_URL = "https://www.youtube.com/iframe_api";

let youtubeApiPromise: Promise<YoutubeIframeApi> | null = null;

/**
 * Nạp script IFrame API của YouTube một lần cho cả trang. Script bị chặn (trình
 * chặn quảng cáo, mất mạng) thì promise lỗi, lần sau gọi sẽ thử nạp lại
 */
export function loadYoutubeIframeApi(): Promise<YoutubeIframeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<YoutubeIframeApi>((resolve, reject) => {
    // Script gọi hàm toàn cục này khi sẵn sàng; giữ hàm cũ nếu thư viện khác đã gắn
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();

      if (window.YT) resolve(window.YT);
    };

    const script = document.createElement("script");

    script.src = YOUTUBE_IFRAME_API_URL;
    script.async = true;
    script.onerror = () => {
      youtubeApiPromise = null;
      script.remove();
      reject(new Error("Không tải được YouTube IFrame API"));
    };
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}
