import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { primaryButtonClassName } from "@/constants";
import { updateLesson } from "@/lib/actions/lesson.action";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
const formSchema = z.object({
  video: z.string().optional(),
  content: z.string().optional(),
});

const CourseContentLesson = ({
  lessonId,
  slug,
  lesson,
}: {
  lessonId: string;
  slug: string;
  lesson: {
    video: string;
    content: string;
  };
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      video: lesson.video,
      content: lesson.content,
    },
  });
  async function onSubmitLesson(values: z.infer<typeof formSchema>) {
    try {
      await updateLesson({
        lessonId,
        path: `/admin/course/content?slug=${slug}`,
        data: {
          ...values,
        },
      });
      toast.success("Bài học đã được cập nhật thành công");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitLesson)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đường dẫn video</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập đường dẫn video"
                  className="bg-gray-100 dark:bg-grayDarker"
                  {...field}
                />
              </FormControl>
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
                <Textarea
                  placeholder="Nhập nội dung"
                  className="bg-gray-100 dark:bg-grayDarker"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-3">
          <Button className={cn(primaryButtonClassName)} type="submit">
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseContentLesson;
