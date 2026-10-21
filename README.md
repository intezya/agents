# Agents

Коллекция скиллов для AI-агентов. Каждый скилл хранится в отдельной папке с инструкцией `SKILL.md`; рядом могут лежать справочники, скрипты и проверки.

## Каталог

- [base](skills/base/) — рабочий процесс агента, исследование, отладка и Next Move Theory.
- [design](skills/design/) — интерфейсы, дизайн-системы, доступность и анимация.
- [developer](skills/developer/) — разработка, архитектура, API и базы данных.
- [devops](skills/devops/) — инфраструктура, Kubernetes, CI/CD и эксплуатация.
- [ecommerce](skills/ecommerce/) — обработка платежей.
- [quality](skills/quality/) — тестирование и проверка качества.
- [security](skills/security/) — анализ угроз и безопасность кода.
- [vpn-management](skills/vpn-management/) — настройка VPN и транспортов.
- [writing](skills/writing/) — написание и редактирование текста.

[Next-Move-Theory-Canon](Next-Move-Theory-Canon/) содержит исходные материалы для скиллов Next Move Theory. Общие инструкции агента находятся в [AGENTS.md](AGENTS.md).

## Работа с текстом

Все текстовые скиллы собраны в `skills/writing/`:

- [unslop](skills/writing/unslop/SKILL.md) — поиск и исправление шаблонов нейросетевого текста. Включает сканеры и проверки; для скриптов нужен Python 3. Источник и ревизия указаны в [UPSTREAM.md](skills/writing/unslop/UPSTREAM.md).
- [ru-text](skills/writing/ru-text/SKILL.md) — русская грамматика, пунктуация, типографика, редактура и тексты интерфейсов.
- [orwell-writing-ru](skills/writing/orwell-writing-ru/SKILL.md) — ясная русская проза по правилам Оруэлла и принципам информационного стиля.
- [humanizer-ru](skills/writing/humanizer-ru/SKILL.md) — редактура русского текста со сканером речевых штампов.

## Установка в Codex

Скопируйте папку нужного скилла целиком в `~/.codex/skills/`, сохранив справочники и скрипты. Например, для трёх текстовых скиллов:

```bash
git clone git@github.com:intezya/agents.git
cd agents
mkdir -p ~/.codex/skills
cp -R skills/writing/unslop skills/writing/ru-text skills/writing/orwell-writing-ru ~/.codex/skills/
```

Скиллы Next Move Theory также используют `Next-Move-Theory-Canon/`. Допустимые пути к этим материалам описаны в их `SKILL.md`.

## Проверка unslop

Из корня репозитория:

```bash
cd skills/writing/unslop
python3 evals/check.py
```

Команда запускает пять детерминированных проверок без обращения к моделям. Другие проверки описаны в [evals/CHECKS.md](skills/writing/unslop/evals/CHECKS.md).

## Лицензии

У импортированных скиллов свои лицензии. Проверяйте `SKILL.md`, `LICENSE` и сведения об источнике внутри выбранного скилла.
