import type { Lesson } from "../../types/lesson";
import { eventLoopLesson } from "./event-loop-lesson";
import { miniExpressLesson } from "./mini-express-lesson";
import { nestLifecycleLesson } from "./nest-lifecycle-lesson";

export const lessonCatalog: Lesson[] = [eventLoopLesson, nestLifecycleLesson, miniExpressLesson];
