import { Module } from "@nestjs/common";
import { CourseRepository } from "./course.repository.js";
import { CoursesController } from "./courses.controller.js";
import { CoursesService } from "./courses.service.js";

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, CourseRepository],
})
export class AppModule {}
