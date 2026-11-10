import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { ArrowUpRight } from "lucide-react";
import {
  EVONDEV_URL,
  INSTRUCTOR_BIO,
  instructorStats,
  LANDING_CONTAINER_CLASS_NAME,
  LANDING_SECTION_CLASS_NAME,
} from "../constants";
import { InstructorStatCard } from "./instructor-stat-card";
import { LandingSectionHeading } from "./landing-section-heading";

/** Người dạy: giới thiệu ngắn bên trái, các con số của evondev bên phải */
export function LandingInstructor() {
  return (
    <section
      className={cn(
        LANDING_SECTION_CLASS_NAME,
        LANDING_CONTAINER_CLASS_NAME,
        "grid gap-12 lg:grid-cols-2 lg:items-center",
      )}
    >
      <div className="flex flex-col gap-6">
        <LandingSectionHeading
          eyebrow="Người dạy"
          title="Mình là Tuấn,"
          mutedTitle="mọi người hay gọi là evondev."
          description={INSTRUCTOR_BIO}
        />
        <Button asChild variant="outline" className="self-start rounded-full">
          <a href={EVONDEV_URL} target="_blank" rel="noreferrer">
            Xem hành trình ở evon.dev
            <ArrowUpRight className="size-4" />
          </a>
        </Button>
      </div>
      <div className="reveal-on-scroll grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border">
        {instructorStats.map((stat) => (
          <InstructorStatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
