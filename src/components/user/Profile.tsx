"use client";
import { primaryButtonClassName } from "@/constants";
import { IUser } from "@/database/user.model";
import { updateUser } from "@/lib/actions/user.action";
import { Role } from "@/types/enums";
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
      bank: user?.bank,
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
          bank: {
            bankAccount: values.bank?.bankAccount || "",
            bankBranch: values.bank?.bankBranch || "",
            bankName: values.bank?.bankName || "",
            bankNumber: values.bank?.bankNumber || "",
          },
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
            {user?.role !== Role.USER && (
              <>
                <FormField
                  control={form.control}
                  name="bank.bankNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tài khoản ngân hàng</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Số tài khoản ngân hàng"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bank.bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên ngân hàng</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên ngân hàng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bank.bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên tài khoản</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên tài khoản" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bank.bankBranch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chi nhánh</FormLabel>
                      <FormControl>
                        <Input placeholder="Chi nhánh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};

export default Profile;
