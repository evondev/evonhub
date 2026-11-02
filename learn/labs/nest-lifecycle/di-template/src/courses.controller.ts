import { Controller, Get } from "@nestjs/common";
import { CoursesService } from "./courses.service.js";
import { logConstructed } from "./construct-log.js";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {
    logConstructed("CoursesController", { coursesService });
  }

  @Get()
  findAll() {
    return this.coursesService.findPublished();
  }
}
