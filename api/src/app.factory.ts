import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { HttpErrorFilter } from "./common/http-error.filter.js";

// main.ts và test cùng dựng app qua hàm này. Cấu hình đặt riêng trong main.ts thì
// test chạy trên một app khác với app thật: thiếu prefix, thiếu filter mà test vẫn xanh.
export async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: ["error", "warn"] });

  app.setGlobalPrefix("api");
  app.useGlobalFilters(new HttpErrorFilter());

  return app;
}
