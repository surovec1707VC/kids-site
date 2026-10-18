import { PrismaClient, TaskType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("cyber123", 12);
  await prisma.user.upsert({
    where: { login: "student_01" },
    update: {},
    create: {
      login: "student_01",
      email: "student@mail.ru",
      passwordHash,
      displayName: "Студент",
    },
  });

  const chapter = await prisma.chapter.upsert({
    where: { slug: "html-basics" },
    update: {},
    create: {
      slug: "html-basics",
      title: "HTML: основы",
      description: "Теги, структура страницы, семантика",
      order: 1,
      isPublished: true,
    },
  });

  const topic = await prisma.topic.upsert({
    where: { chapterId_slug: { chapterId: chapter.id, slug: "first-page" } },
    update: {},
    create: {
      chapterId: chapter.id,
      slug: "first-page",
      title: "Первая страница",
      summary: "Из чего состоит HTML-документ",
      content:
        "# Первая страница\n\nКаждая страница начинается с <!doctype html> и тега <html>.",
      order: 1,
      estimatedMinutes: 10,
    },
  });

  const existingTask = await prisma.task.findFirst({ where: { topicId: topic.id, order: 1 } });
  if (!existingTask) {
    await prisma.task.create({
      data: {
        topicId: topic.id,
        type: TaskType.QUIZ,
        title: "Главный тег",
        prompt: "Какой тег оборачивает всё содержимое страницы?",
        payload: { options: ["<body>", "<html>", "<head>", "<main>"] },
        solution: { correctIndex: 1 },
        xpReward: 10,
        order: 1,
      },
    });
  }

  await prisma.achievement.upsert({
    where: { code: "first-step" },
    update: {},
    create: {
      code: "first-step",
      title: "Первый шаг",
      description: "Решите первое задание",
      xpReward: 20,
    },
  });

  console.warn("Seed: готово");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
