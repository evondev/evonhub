import { Injectable } from "@nestjs/common";
import { CourseRepository } from "./course.repository.js";
import { logConstructed } from "./construct-log.js";

@Injectable()
export class CoursesService {
  constructor(private readonly courseRepository: CourseRepository) {
    logConstructed("CoursesService", { courseRepository });
  }

  findPublished() {
    return this.courseRepository.findAll().filter((course) => course.status === "approved");
  }
}
