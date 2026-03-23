"use server";

import UserModel from "@/modules/user/models";
import { MicroStatus } from "@/shared/constants/micro.constant";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import MicroModel from "../models";
import { MicroItemData } from "../types";

interface CreateMicroParams {
  title: string;
  slug?: string;
}
export async function createMicro(params: CreateMicroParams) {
  try {
    connectToDatabase();

    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });

    if (findUser && ![UserRole.Admin].includes(findUser?.role))
      return undefined;

    const { title, slug } = params;

    const allVideos = await MicroModel.find();
    const existSlug = allVideos.some((item) => item.slug === slug);
    if (existSlug) {
      return {
        type: "error",
        message: "Đường dẫn video đã tồn tại!",
      };
    }

    await MicroModel.create({
      title,
      slug,
      _destroy: false,
      author: findUser?._id,
    });
  } catch (error) {}
}
interface UpdateMicroParams {
  slug: string;
  updateData: Partial<MicroItemData>;
  microSlug: string;
}
export async function updateMicro(params: UpdateMicroParams) {
  try {
    connectToDatabase();

    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });

    if (findUser && ![UserRole.Admin].includes(findUser?.role))
      return undefined;

    const allVideos = await MicroModel.find();
    const existVideo = allVideos.some(
      (item) => item.slug === params.slug && item.slug !== params.microSlug,
    );

    if (existVideo) {
      return {
        type: "error",
        message: "Đường dẫn này đã tồn tại!",
      };
    }

    await MicroModel.findOneAndUpdate(
      { slug: params.microSlug },
      params.updateData,
      {
        new: true,
      },
    );
  } catch (error) {}
}

export async function fetchVideoBySlug(
  slug: string,
): Promise<MicroItemData | undefined> {
  try {
    connectToDatabase();

    const video = await MicroModel.findOne({ slug, _destroy: false });
    return parseData(video);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchVideosManage() {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });

    if (findUser && ![UserRole.Admin].includes(findUser?.role))
      return undefined;

    const videos = await MicroModel.find({ _destroy: false }).populate(
      "author",
      "name email",
    );
    return parseData(videos);
  } catch (error) {
    console.log(error);
  }
}

interface FetchVideosProps {
  status?: MicroStatus;
}

export async function fetchVideos({ status }: FetchVideosProps = {}): Promise<
  MicroItemData[] | undefined
> {
  try {
    connectToDatabase();

    let query: FilterQuery<typeof MicroModel> = {};

    if (status) {
      query.status = status;
    }

    const videos = await MicroModel.find({
      _destroy: false,
      ...query,
    }).populate("author", "name email");
    return parseData(videos);
  } catch (error) {
    console.log(error);
  }
}
