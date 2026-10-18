# База данных

PostgreSQL, схема — `prisma/schema.prisma`. Диаграмма ниже отрисовывается прямо на GitHub.

## ER-диаграмма

```mermaid
erDiagram
    User ||--o{ RefreshToken : "сессии"
    User ||--o{ TaskAttempt : "попытки"
    User ||--o{ TopicProgress : "прогресс"
    User ||--o{ UserAchievement : "получил"
    User ||--o{ XpEvent : "опыт"
    Chapter ||--o{ Topic : "содержит"
    Topic ||--o{ Task : "содержит"
    Topic ||--o{ TopicProgress : ""
    Task ||--o{ TaskAttempt : ""
    Achievement ||--o{ UserAchievement : ""

    User {
        string id PK
        string login UK
        string email UK
        string passwordHash
        Role role
        int xp
        int level
    }
    RefreshToken {
        string id PK
        string tokenHash UK
        string userId FK
        datetime expiresAt
        datetime revokedAt
    }
    Chapter {
        string id PK
        string slug UK
        string title
        int order
        boolean isPublished
    }
    Topic {
        string id PK
        string chapterId FK
        string slug
        string title
        string content
        int order
    }
    Task {
        string id PK
        string topicId FK
        TaskType type
        string prompt
        json payload
        json solution
        int xpReward
        int order
    }
    TaskAttempt {
        string id PK
        string userId FK
        string taskId FK
        json answer
        boolean isCorrect
        int score
    }
    TopicProgress {
        string userId PK
        string topicId PK
        ProgressStatus status
        int percent
    }
    Achievement {
        string id PK
        string code UK
        string title
        int xpReward
    }
    UserAchievement {
        string userId PK
        string achievementId PK
        datetime earnedAt
    }
    XpEvent {
        string id PK
        string userId FK
        int amount
        string reason
    }
```

## Таблицы

| Таблица | Назначение | Важное |
|---|---|---|
| User | ученики и администраторы | `login` и `email` уникальны; `xp`, `level` — денормализованная сумма для быстрых выборок |
| RefreshToken | активные сессии | хранится только хеш токена; `revokedAt` для отзыва и ротации |
| Chapter | глава курса | `order` задаёт порядок, `isPublished` скрывает черновики |
| Topic | тема внутри главы | `slug` уникален в пределах главы; `content` — Markdown |
| Task | задание темы | `type`: QUIZ, CODE, TEXT; `payload` — данные для клиента; `solution` — только для сервера |
| TaskAttempt | каждая попытка ответа | история не удаляется: из неё считается статистика |
| TopicProgress | прогресс по теме | составной ключ `(userId, topicId)` |
| Achievement | справочник достижений | `code` — стабильный идентификатор для кода |
| UserAchievement | выданные достижения | составной ключ: одно достижение выдаётся один раз |
| XpEvent | журнал начислений опыта | источник правды для `User.xp` |

## Правила

- Удаление пользователя каскадно удаляет его сессии, попытки, прогресс и опыт.
- Удаление главы удаляет её темы и задания. Для опубликованного контента используйте `isPublished = false` вместо удаления.
- Начисление опыта: запись в `XpEvent` и обновление `User.xp` — в одной транзакции.
- Миграции создаются командой `npm run db:migrate -- --name <что_изменили>` и коммитятся в `prisma/migrations`.
