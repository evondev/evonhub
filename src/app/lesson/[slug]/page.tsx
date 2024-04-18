import {
  IconFavorite,
  IconLike,
  IconShare,
  IconViews,
} from "@/components/icons";
import Image from "next/image";

const Lesson = () => {
  return (
    <div>
      <div className="grid grid-cols-[2fr,1fr] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <div className="bg-bgDark3 rounded-lg">
            <iframe
              src="https://www.youtube.com/embed/bb7ukL08L9s"
              title="Chia sẻ tình hình về Frontend trong năm 2024 và các dự định của mình"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full aspect-video"
            />
            <div className="p-5">
              <div className="mb-5 pb-5 border-b border-text2">
                <div className="flex items-center gap-3">
                  <Image
                    alt=""
                    src="https://spotlight-modern.highfivethemes.com/content/images/size/w1000/format/webp/2023/06/demo-image-00008.webp"
                    width={80}
                    height={80}
                    className="w-12 h-12 rounded-full object-cover"
                  ></Image>
                  <div>
                    <h4 className="font-bold leading-none">Evondev</h4>
                    <span className="text-xs text-text3">
                      Frontend Developer
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-text4 text-xs">
                  <IconViews></IconViews>
                  <span>79.5k Views</span>
                </div>
                <div className="flex items-center gap-2 text-text4 text-xs">
                  <IconLike></IconLike>
                  <span>79.5k Likes</span>
                </div>
                <div className="flex items-center gap-2 text-text4 text-xs">
                  <IconShare></IconShare>
                  <span>Share</span>
                </div>
                <div className="flex items-center gap-2 text-text4 text-xs">
                  <IconFavorite></IconFavorite>
                  <span>Favorite</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-bgDark3 rounded-lg p-5">
            <h2 className="font-bold text-xl">Content</h2>
          </div>
          <div className="bg-bgDark3 rounded-lg p-5">
            <h2 className="font-bold text-xl">Threads</h2>
          </div>
        </div>
        <div className="p-5 bg-bgDark3 rounded-lg"></div>
      </div>
      <div></div>
    </div>
  );
};

export default Lesson;
