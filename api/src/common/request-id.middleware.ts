import { randomUUID } from "node:crypto";
import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

export const REQUEST_ID_HEADER = "x-request-id";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    // TODO (mốc 1): mỗi request có một id để lần theo trong log.
    // - Client (hay load balancer) gửi sẵn header x-request-id thì dùng lại id đó, không thì tạo bằng randomUUID().
    // - Gắn id vào request.requestId để các lớp sau đọc được.
    // - Gắn id vào header x-request-id của response.

    next();
  }
}
