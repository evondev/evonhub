// Phần YouTube IFrame Player API mà dự án dùng (https://developers.google.com/youtube/iframe_api_reference).
// Khai tay thay vì cài @types/youtube cho vài hàm

interface YoutubePlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: () => void;
  };
}

interface YoutubePlayer {
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
}

interface YoutubeIframeApi {
  Player: new (
    element: HTMLElement,
    options: YoutubePlayerOptions,
  ) => YoutubePlayer;
  PlayerState: {
    PLAYING: number;
  };
}

interface Window {
  YT?: YoutubeIframeApi;
  onYouTubeIframeAPIReady?: () => void;
}
