import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";
import { record } from "./trace.js";

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    record("interceptor (trước)");

    return next.handle().pipe(tap(() => record("interceptor (sau)")));
  }
}
