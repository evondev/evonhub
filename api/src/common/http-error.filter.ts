import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";

export interface ErrorBody {
  statusCode: number;
  message: string;
  path: string;
  requestId?: string;
}

// @Catch() không tham số: bắt mọi lỗi, cả lỗi Nest ném (HttpException) lẫn lỗi bất ngờ (TypeError…).
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    // TODO (mốc 1): trả mọi lỗi về cùng một dạng ErrorBody.
    // - HttpException (NotFoundException, 404 route lạ…): lấy status bằng exception.getStatus(), message từ exception.message.
    // - Lỗi khác: 500, message "Internal server error". Chi tiết lỗi chỉ ghi vào log server (console.error),
    //   không gửi cho client.
    // - path lấy từ request.originalUrl, requestId từ request.requestId.

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "TODO" });
  }
}
