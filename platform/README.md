# CyberLearn Platform

Учебная платформа по вёрстке для детей и подростков: главы → темы → задания, прогресс, опыт и достижения.

Стек: Next.js 14 (App Router) + TypeScript, Tailwind CSS на дизайн-токенах, PostgreSQL + Prisma, JWT (access + refresh) и bcrypt.

## Требования

- Node.js 20 (`nvm use` подхватит версию из `.nvmrc`)
- Docker (для локальной PostgreSQL) или своя PostgreSQL 14+

## Запуск

```bash
cp .env.example .env              # затем впишите свои JWT-секреты
docker compose up -d db           # PostgreSQL на localhost:5432
npm install                       # также генерирует Prisma Client
npm run db:migrate -- --name init # создаёт таблицы
npm run db:seed                   # демо-данные: student_01 / cyber123
npm run dev                       # http://localhost:3000
```

Проверка: `http://localhost:3000/api/health` отвечает `{"status":"ok","database":"up"}`.

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | Сервер разработки |
| `npm run build` / `npm start` | Продакшен-сборка и запуск |
| `npm run lint` | ESLint |
| `npm run typecheck` | Проверка типов TypeScript |
| `npm run format` / `format:check` | Prettier |
| `npm run db:migrate` | Новая миграция по `prisma/schema.prisma` |
| `npm run db:deploy` | Применить миграции на сервере |
| `npm run db:seed` | Демо-данные |
| `npm run db:studio` | Prisma Studio (просмотр БД) |

## Структура

```
platform/
├── docs/                  # архитектура, дизайн-система, схема БД
├── prisma/
│   ├── schema.prisma      # модели БД
│   └── seed.ts            # демо-данные
└── src/
    ├── app/               # маршруты Next.js (страницы и API)
    │   └── api/health/    # проверка живости
    ├── features/          # бизнес-логика по доменам
    │   ├── auth/
    │   ├── learning/
    │   ├── gamification/
    │   └── content/
    ├── shared/ui/         # общие UI-компоненты без бизнес-логики
    ├── lib/               # инфраструктура: prisma, env
    └── styles/tokens.css  # дизайн-токены
```

## Документация

- [Архитектура](docs/ARCHITECTURE.md) — решения, слои, правила импорта, аутентификация
- [Дизайн-система](docs/DESIGN_SYSTEM.md) — палитра, типографика, правила анимаций
- [База данных](docs/DATABASE.md) — ER-диаграмма и описание таблиц
