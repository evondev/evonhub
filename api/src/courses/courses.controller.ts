import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { CoursesService } from "./courses.service.js";

@Controller("courses")
export class CoursesController {
  // TODO (mốc 1): nhận CoursesService qua constructor. Bro không tự new, Nest tạo và truyền vào.

  @Get()
  findAll() {
    // TODO (mốc 1): trả danh sách khoá đã duyệt (CoursesService.findPublished).
    return [];
  }

  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    // TODO (mốc 1): tìm khoá theo slug (CoursesService.findBySlug). Không có thì ném NotFoundException.
    return { slug };
  }
}
