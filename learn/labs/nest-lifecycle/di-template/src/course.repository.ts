import { Injectable } from "@nestjs/common";
import { logConstructed } from "./construct-log.js";

@Injectable()
export class CourseRepository {
  constructor() {
    logConstructed("CourseRepository", {});
  }

  findAll() {
    return [
      { slug: "nextjs-14-fullstack", status: "approved" },
      { slug: "nestjs-mysql", status: "pending" },
    ];
  }
}
