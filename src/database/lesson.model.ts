export interface ILesson extends Document {
  id: string;
  title: string;
  slug: string;
  type: string;
  video: string;
  duration: number;
  content: string;
  status: string;
  createdAt: string;
}
