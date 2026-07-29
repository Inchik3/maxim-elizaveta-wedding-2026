# Свадебное приглашение Максима и Елизаветы

Одностраничный свадебный сайт-приглашение на 29 августа 2026 года.

## Локальный запуск

```bash
npm install
npm run dev
```

Production-сборка:

```bash
npm run build
```

Статическая сборка для GitHub Pages:

```bash
npm run build:github
```

## GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` автоматически собирает и
публикует сайт после каждого обновления ветки `main`.

Публичный адрес:

```text
https://inchik3.github.io/maxim-elizaveta-wedding-2026/
```

## Анкета гостя

Чтобы ответы отправлялись в Google Sheets:

1. Разверните код из `google-apps-script/Code.gs` как веб-приложение.
2. Скопируйте `.env.example` в `.env.local`.
3. Укажите URL веб-приложения в `VITE_RSVP_SCRIPT_URL`.

Если переменная не задана, форма работает в безопасном демо-режиме.

## Музыка

Добавьте предоставленный аудиофайл по пути:

```text
public/audio/wedding-song.mp3
```

Если файла нет, музыкальная кнопка автоматически становится неактивной.
