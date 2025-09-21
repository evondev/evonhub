"use client";
import Image from "next/image";

export interface CertificateProps {
  image: string;
  courseTitle: string;
  username: string;
}

export function Certificate({
  image,
  courseTitle,
  username,
}: CertificateProps) {
  return (
    <div>
      <div className="w-[1290px] aspect-video relative pointer-events-none">
        <Image
          src={image}
          alt="certificate"
          width={1920}
          height={1080}
          className="object-cover size-full"
        />
        <div className="absolute inset-0 z-10 bg-black/40 text-white flex flex-col items-center justify-center gap-4">
          <Image src="/star-medal.png" width={100} height={100} alt="medal" />
          <h3 className="text-2xl">Certificate of Completion</h3>
          <h2 className="uppercase font-extrabold text-5xl">{username}</h2>
          <div className="flex items-center gap-2 w-full max-w-[250px]">
            <div className="flex-1 w-full h-0.5 bg-[#FBCD69]"></div>
            <Image src="/star.png" width={20} height={20} alt="medal" />
            <div className="flex-1 w-full h-0.5 bg-[#FBCD69]"></div>
          </div>
          <div className="font-medium">
            Đã hoàn thành khóa học <span>{courseTitle}</span>
          </div>
        </div>
        <div className="absolute z-20 bottom-5 left-5 text-white">
          <h3 className="font-bold text-lg leading-none">EvonHub.dev</h3>
          <h4 className="text-primary font-medium text-sm">by EvonDev</h4>
        </div>
        <div className="absolute z-20 bottom-5 right-5 text-white">
          <h3 className="text-base">{new Date().toLocaleDateString()}</h3>
        </div>
      </div>
    </div>
  );
}
