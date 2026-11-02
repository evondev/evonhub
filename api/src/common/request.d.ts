// Gắn thêm field cho Request của Express, để mọi lớp sau middleware đọc được request.requestId.
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export {};
