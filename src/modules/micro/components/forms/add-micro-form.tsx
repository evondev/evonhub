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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { z } from "zod";
import { useMutationCreateMicro } from "../../services";

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Tiêu đề phải có ít nhất 10 ký tự",
  }),
  slug: z.string().optional(),
});

export default function AddMicroForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const mutationCreateMicro = useMutationCreateMicro();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const { title, slug } = values;
    let newSlug = slug || "";
    if (!slug) {
      newSlug = slugify(title, { lower: true });
    }
    try {
      const response = await mutationCreateMicro.mutateAsync({
        title,
        slug: newSlug,
      });
      if (response?.type === "error") {
        return toast.error(response.message);
      }
      form.reset();
      toast.success("Video đã được thêm thành công");
      router.push(`/admin/micro/update?slug=${newSlug}`);
    } catch (error) {
      toast.error("Tạo video thất bại");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="l-container"
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề*</FormLabel>
                <FormControl>
                  <Input placeholder="Tiêu đề" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đường dẫn</FormLabel>
                <FormControl>
                  <Input placeholder="Đường dẫn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-10 flex justify-end">
          <Button
            type="submit"
            className="h-12 bg-primary dark:bg-primary dark:text-white text-white font-bold w-[150px]"
            isLoading={isSubmitting}
          >
            Thêm video
          </Button>
        </div>
      </form>
    </Form>
  );
}
