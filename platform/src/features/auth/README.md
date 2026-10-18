# auth

Регистрация, вход, выход, обновление токенов.

- `server/password.ts` — хеширование паролей (bcrypt, 12 раундов).
- `server/tokens.ts` — access JWT (HS256, 15 мин) и refresh-токены (случайные, хеш в БД, 30 дней).
- `constants.ts` — имена cookie.

Модели: `User`, `RefreshToken`.
Схема потока и правила безопасности: `docs/ARCHITECTURE.md`, раздел «Аутентификация».
