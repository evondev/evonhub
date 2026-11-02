const { setTimeout: wait } = require("node:timers/promises");

// Dữ liệu như mốc 1 của evonhub-api: html-css-2019 là bản ghi cũ, thiếu field rating.
const courses = [
  { slug: "nextjs-14-fullstack", title: "Next.js 14 Fullstack: Xây dựng Evonhub", rating: [5, 5, 4, 5] },
  { slug: "html-css-2019", title: "HTML CSS 2019" },
];

async function findCourse(slug) {
  await wait(5);
  const course = courses.find((record) => record.slug === slug);
  if (!course) return undefined;

  const averageRating = course.rating.reduce((total, star) => total + star, 0) / course.rating.length;
  return { slug: course.slug, title: course.title, averageRating };
}

module.exports = { findCourse };
