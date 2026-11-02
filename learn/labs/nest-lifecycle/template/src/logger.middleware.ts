import { Injectable, NestMiddleware } from "@nestjs/common";
import { record } from "./trace.js";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: unknown, response: unknown, next: () => void) {
    record("middleware");
    next();
  }
}
