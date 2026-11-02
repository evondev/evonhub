import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { RequestIdMiddleware } from "./common/request-id.middleware.js";
import { CoursesModule } from "./courses/courses.module.js";
import { HealthController } from "./health/health.controller.js";

@Module({
  imports: [CoursesModule],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("{*path}");
  }
}
