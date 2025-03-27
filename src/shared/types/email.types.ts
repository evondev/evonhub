export interface EmailModelProps extends Document {
  id: string;
  title: string;
  content: string;
  recipients: string[];
  status: EmailStatus;
  createdAt: Date;
}
export enum EmailStatus {
  Success = "success",
  Failed = "failed",
}
