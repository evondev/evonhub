import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "./auth.guard.js";
import { CreateOrderBody, PositiveAmountPipe } from "./positive-amount.pipe.js";
import { TimingInterceptor } from "./timing.interceptor.js";
import { record } from "./trace.js";

@Controller("orders")
@UseGuards(AuthGuard)
@UseInterceptors(TimingInterceptor)
export class OrdersController {
  @Post()
  create(@Body(PositiveAmountPipe) body: CreateOrderBody) {
    record("handler");

    return { id: 1024, ...body };
  }
}
