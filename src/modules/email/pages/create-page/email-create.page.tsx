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
import { Switch } from "@/components/ui/switch";
import { editorOptions } from "@/constants";
import { Heading } from "@/shared/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { sendEmailSchema } from "../../schemas";
import { userMutationSendEmails } from "../../services/data/mutation-send-emails.data";
import { SendEmailFormValues } from "../../types";

export interface EmailCreatePageProps {}

export function EmailCreatePage(_props: EmailCreatePageProps) {
  const form = useForm<SendEmailFormValues>({
    resolver: zodResolver(sendEmailSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();
  const [isTestMode, setIsTestMode] = useState(false);

  const mutationSendEmails = userMutationSendEmails();

  async function handleSendEmails({
    to = [],
    values,
  }: {
    to: string[];
    values: SendEmailFormValues;
  }) {
    const response = await mutationSendEmails.mutateAsync({
      to,
      title: values.title,
      content: values.content,
    });

    if (response) {
      toast.success("Gửi email thành công");
      return;
    }
    toast.error("Gửi email thất bại");
  }

  async function onSubmit(values: SendEmailFormValues) {
    try {
      if (!isTestMode) {
        toast.error("Hiện tại chỉ hỗ trợ gửi test");
        return;
      }

      await handleSendEmails({
        to: [`${process.env.NEXT_PUBLIC_TEST_EMAIL}`],
        values,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          className="mx-auto max-w-3xl"
        >
          <Heading>Gửi emails</Heading>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề *</FormLabel>
                  <FormControl>
                    <Input placeholder="Tiêu đề" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                      // @ts-ignore
                      // onInit={(evt, editor) => (editorRef.current = editor)}
                      onInit={(_evt, editor) => {
                        (editorRef.current = editor).setContent("");
                      }}
                      value={field.value}
                      {...editorOptions(field, theme, 600)}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormItem className="flex items-center gap-2">
              <FormLabel>Gửi test</FormLabel>
              <Switch
                className="!mt-0"
                checked={isTestMode}
                onCheckedChange={(checked) => setIsTestMode(checked)}
              />
            </FormItem>
            {/* Tạm ẩn: gửi cho học viên mua khóa + gửi cho danh sách cũ
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Gửi cho học viên mua khóa</FormLabel>
              <Select onValueChange={(value) => setSelectedCourseId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khóa học" />
                </SelectTrigger>
                <SelectContent>
                  {courses &&
                    courses.length > 0 &&
                    courses.map((course) => (
                      <SelectItem key={course._id} value={course._id?.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Gửi cho danh sách cũ</FormLabel>
            </FormItem>
            */}
            <Button
              type="submit"
              variant="primary"
              className="w-[120px] ml-auto flex"
              isLoading={mutationSendEmails.isPending}
            >
              Gửi
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
