import { Button } from "@/shared/ui/Button";
import { ProgressBar } from "@/shared/ui/ProgressBar";

const chapters = [
  { title: "HTML: основы", done: 3, total: 8 },
  { title: "CSS: стили", done: 0, total: 8 },
  { title: "Flexbox", done: 0, total: 8 },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-content flex-col gap-16 px-6 py-16 md:px-12">
      <header className="flex items-center justify-between">
        <span className="font-mono text-lg font-bold">
          cyber<span className="text-accent">learn</span>
          <span className="text-magenta">_</span>
        </span>
        <Button variant="secondary">Войти</Button>
      </header>

      <section className="flex max-w-prose flex-col gap-6">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          Учимся верстать страницы с нуля
        </h1>
        <p className="text-lg text-fg-muted">
          Короткие уроки по HTML и CSS, после каждого — задание с проверкой. Прогресс сохраняется,
          можно вернуться в любой момент.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button>Начать первый урок</Button>
          <Button variant="secondary">Посмотреть программу</Button>
        </div>
      </section>

      <section aria-labelledby="chapters" className="flex flex-col gap-6">
        <h2 id="chapters" className="text-xl font-semibold">
          Программа
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {chapters.map((chapter) => (
            <li
              key={chapter.title}
              className="flex flex-col gap-4 rounded-lg border border-line bg-bg-surface p-6"
            >
              <h3 className="font-semibold">{chapter.title}</h3>
              <ProgressBar
                value={chapter.done}
                max={chapter.total}
                label={chapter.done + " из " + chapter.total + " уроков"}
              />
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
