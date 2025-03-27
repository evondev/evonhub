export interface EmailModelProps extends Document {
  id: string;
  title: string;
  content: string;
  recipients: string[];
  createdAt: Date;
}
