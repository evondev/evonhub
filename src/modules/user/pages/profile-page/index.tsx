"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/components/user-context";
import { primaryButtonClassName } from "@/constants";
import { updateUser } from "@/lib/actions/user.action";
import { UserRole } from "@/shared/constants/user.constants";
import { updateUserSchema } from "@/utils/formSchema";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { UserPlan } from "./components";

export function UserProfilePage() {
  const { userInfo } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: userInfo?.name,
      email: userInfo?.email,
      username: userInfo?.username,
      bio: userInfo?.bio,
      avatar: userInfo?.avatar,
      bank: userInfo?.bank,
    },
  });

  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    if (!userInfo) return;
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId: userInfo?.clerkId,
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

  useEffect(() => {
    form.reset({
      name: userInfo?.name,
      email: userInfo?.email,
      username: userInfo?.username,
      bio: userInfo?.bio,
      avatar: userInfo?.avatar,
      bank: userInfo?.bank,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  if (!userInfo) return null;

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="flex items-end flex flex-col gap-5">
          <UserButton showName />
        </div>
        <div className="flex items-start gap-0 lg:gap-10 flex-col lg:flex-row">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              autoComplete="off"
              className="w-full"
            >
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
                        <Input
                          placeholder="Email"
                          disabled
                          value={field.value}
                        />
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
                {userInfo?.role !== UserRole.User && (
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
              <div className="flex justify-end gap-2 mb-5 w-full">
                <Button
                  type="submit"
                  className={primaryButtonClassName}
                  isLoading={isSubmitting}
                >
                  Cập nhật
                </Button>
              </div>
            </form>
          </Form>
          <UserPlan />
        </div>
      </div>
    </div>
  );
}
