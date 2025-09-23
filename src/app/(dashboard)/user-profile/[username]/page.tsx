import { Heading } from "@/shared/components";
import Image from "next/image";

export interface UserInformationProfilePageRootProps {}

export default function UserInformationProfilePageRoot(
  _props: UserInformationProfilePageRootProps
) {
  return (
    <div>
      <Heading>UI will be update soon...</Heading>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-[1fr,3fr] gap-8">
          <div className="p-5 borderDarkMode rounded-lg bgDarkMode">
            <div className="size-40 rounded-full borderDarkMode relative visible">
              <Image
                src="/gems/gem-rank1.png"
                width={40}
                height={40}
                alt="User Avatar"
                className="absolute bottom-0 right-0"
              />
            </div>
          </div>
          <div className="borderDarkMode p-5 rounded-lg bgDarkMode"></div>
        </div>
        <div className="borderDarkMode p-5 rounded-lg bgDarkMode h-40"></div>
        <div className="borderDarkMode p-5 rounded-lg bgDarkMode h-40"></div>
      </div>
    </div>
  );
}
