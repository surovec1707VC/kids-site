# gamification

Опыт (XP), уровни и достижения.

Модели: `XpEvent`, `Achievement`, `UserAchievement`, поля `User.xp` и `User.level`.
Каждое начисление опыта пишется в `XpEvent`. `User.xp` обновляется в той же транзакции.
