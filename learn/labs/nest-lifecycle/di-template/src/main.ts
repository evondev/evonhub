// Harness của bài: in metadata TypeScript ghi lại, xem Nest gọi constructor nào với gì, rồi gửi vài request.
import "reflect-metadata";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { constructCounts } from "./construct-log.js";
import { CoursesController } from "./courses.controller.js";
import { CoursesService } from "./courses.service.js";

const REQUEST_COUNT = 3;

interface JsonResponse {
  status(statusCode: number): { json(body: unknown): void };
}

// In lỗi phía server ra output để thấy nguyên nhân, client vẫn chỉ nhận 500.
@Catch()
class PrintErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log(`   lỗi phía server: ${exception instanceof Error ? `${exception.name}: ${exception.message}` : exception}`);
    host.switchToHttp().getResponse<JsonResponse>().status(500).json({ message: "Internal server error" });
  }
}

function describeParamTypes(target: object) {
  const paramTypes: Function[] | undefined = Reflect.getMetadata("design:paramtypes", target);

  return paramTypes ? `[${paramTypes.map((paramType) => paramType.name).join(", ")}]` : "(không có)";
}

console.log("1. TypeScript ghi lại kiểu tham số constructor (design:paramtypes):");
console.log(`   CoursesController → ${describeParamTypes(CoursesController)}`);
console.log(`   CoursesService    → ${describeParamTypes(CoursesService)}`);

console.log("2. Nest dựng app, gọi constructor:");
const app = await NestFactory.create(AppModule, { logger: false });
app.useGlobalFilters(new PrintErrorFilter());
await app.listen(0, "127.0.0.1");
const baseUrl = (await app.getUrl()).replace("[::1]", "127.0.0.1");

console.log(`3. Gửi ${REQUEST_COUNT} request GET /courses:`);
const statuses: number[] = [];

for (let requestIndex = 0; requestIndex < REQUEST_COUNT; requestIndex += 1) {
  const response = await fetch(`${baseUrl}/courses`);
  statuses.push(response.status);
  await response.text();
}

console.log(`   status: ${statuses.join(" · ")}`);
console.log("4. Số lần mỗi class bị new:");

for (const [className, count] of constructCounts) {
  console.log(`   ${className}: ${count}`);
}

await app.close();
console.log("__RESULT__" + JSON.stringify({ checks: [{ label: "Đã chạy xong, xem output ở trên", isPassed: true }] }));
