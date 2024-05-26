export interface INotification extends Document {
  _id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}
