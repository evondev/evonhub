import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { record } from "./trace.js";

export interface CreateOrderBody {
  courseId: string;
  amount: number;
}

@Injectable()
export class PositiveAmountPipe implements PipeTransform {
  transform(body: CreateOrderBody) {
    record("pipe");

    if (typeof body?.courseId !== "string" || !body.courseId) {
      throw new BadRequestException("courseId là bắt buộc");
    }

    if (typeof body.amount !== "number" || body.amount <= 0) {
      throw new BadRequestException("amount phải là số dương");
    }

    return body;
  }
}
