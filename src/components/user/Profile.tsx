"use client";
import { primaryButtonClassName } from "@/constants";
import { IUser } from "@/database/user.model";
import { updateUser } from "@/lib/actions/user.action";
import { updateUserSchema } from "@/utils/formSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const Profile = ({ user }: { user: IUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
    },
  });
  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId: user.clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          bio: values.bio,
        },
        path: "/profile",
      });
      toast.success("Cập nhật thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  const image = form.watch("avatar");
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
          <div className="flex justify-end gap-2 mb-5">
            <Button
              type="submit"
              className={primaryButtonClassName}
              isLoading={isSubmitting}
            >
              Cập nhật
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 mb-10">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" disabled value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="Bio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <>
                      {image && (
                        <div className="relative group">
                          <Image
                            src={image}
                            alt="Course Image"
                            width={200}
                            height={150}
                            className="w-full h-[250px] rounded-lg object-cover"
                          />
                          <button
                            className={cn(
                              actionClassName,
                              "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hover:bg-red-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                            )}
                            onClick={() => form.setValue("avatar", "")}
                          >
                            <IconDelete />
                          </button>
                        </div>
                      )}
                      {!image && (
                        <UploadDropzone
                          className="justify-center items-center bg-white dark:bg-grayDarker rounded-lg h-[250px]"
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            form.setValue("avatar", res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                          }}
                        />
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        </form>
      </Form>
    </>
  );
};

export default Profile;