# User context

- The user is intezya.
- The user's GitHub profile is https://github.com/intezya.
- The user has a private environment file at `~/.secrets/.env`; do not record or expose its secret values.

# Workflow

- Always use the `using-superpowers` skill at the start of every task, before responding or taking any action.
- Always use the `superpowers:brainstorming` skill for every task, before implementation.
- Use the `ask-questions-if-underspecified` skill before implementation whenever the request has multiple plausible interpretations or lacks essential requirements.

# Vault Access

- For authorized Vault tasks, prefer the installed official `vault` CLI, including
  a locally configured wrapper/token helper, over a new ad hoc client.
- Use `skills/devops/security/vault/SKILL.md` and its agent CLI reference. Discover
  local authentication and TLS instructions before accessing a deployment.
- Capture secret-bearing CLI responses inside a local process and pass only the
  required values to the authorized consumer through private stdin or files.
  Never expose them in tool output, chat, Git, logs, command arguments, or tracing.

# Service Removal

- When removing a service, check its associated domains and DNS records at the provider (for example, Cloudflare). Delete records that are no longer used as part of the service removal, without requiring a separate reminder. Before deleting a record, verify that no other service needs it; afterwards, verify its absence at the provider. Removing a domain from Dokploy does not by itself remove the DNS record.

# Git Workflow

- Always use the `using-git-worktrees` skill to create and work in a dedicated Git worktree for every task. Never make task-related changes in the primary checkout.
- The primary/default branch of every repository must be named `master`.
- Name task branches using `<type>/<short-kebab-case-description>`, where `<type>` describes the change, such as `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`. Example: `feat/create-this-change`.
- If the repository uses a task tracker and the task has an issue key, include it in the branch name: `<type>/<ISSUE-KEY>-<short-kebab-case-description>`. Example: `fix/LP-123-correct-login-redirect`.
- If the repository uses a task tracker but the task has no issue key, ask the user whether a task should be created before creating the branch. Never create or assume an issue key without confirmation.

## Интерфейс и дизайн-система

### Источники и маршрутизация

- Для UI-задач сначала прочитай корневой `DESIGN.md`, затем относящиеся к задаче
  индексы и контракты. Используй установленный скилл `design-system`.
- Скилл отвечает за дизайн-систему, но не заменяет процесс разработки проекта.
  Сохраняй спецификации и планы в `docs/` по принятой структуре.
- Загружай только необходимые инструкции и контракты, а не всю документацию.
- Не придумывай отсутствующие дизайн-правила, пути, API или команды проверок.
  Сначала исследуй источники проекта; запрашивай только неразрешимые решения.
  Отсутствие контракта не означает, что компонента нет.

### Внешние источники UI/UX

- При каждой задаче на проектирование или оценку UI/UX обращайся за принципами
  и примерами на [bureau.ru](https://bureau.ru/). Ищи материалы отдельно для
  внутренних интерфейсов (админки, CRM, рабочие кабинеты) и клиентских сценариев
  (личные кабинеты, оформление заказа, самообслуживание).
- Начинай с разделов сайта по пользовательскому интерфейсу и UX/UI, затем ищи
  подходящие разборы, главы и проекты запросами вроде «админка», «рабочий
  интерфейс», «личный кабинет», «форма», «таблица» и по задаче пользователя.
  Открывай первоисточник и сверяй пример с нужным сценарием.
- Используй найденное как совет и обоснование, а не как готовый шаблон. Учитывай
  аудиторию, роль, задачу, доступность и действующие `DESIGN.md` и контракты
  проекта. При использовании конкретной рекомендации указывай ссылку на источник.
- Если подходящий материал не находится или сайт недоступен, сообщи об этом
  и продолжай по источникам проекта; не выдумывай рекомендации от имени бюро.

### Проверка текста

- Перед передачей любого текста, который ты написал или существенно изменил,
  проверь русский текст навыком `humanizer-ru`, а затем — `ru-text` для
  редакторской проверки и типографики. Для интерфейсных строк загружай из
  `ru-text` правила UX-writing. Для текста на других языках используй
  подходящий языковой навык, если он установлен.
- Сохраняй факты, смысл, терминологию продукта, ограничения и голос автора.
  Не переписывай дословные цитаты, код, идентификаторы и пользовательские
  формулировки как авторский текст.
- Если навык или его сканер недоступен, явно отметь ограничение и не заявляй,
  что проверка пройдена. Отсутствие проверки не заменяй выдуманным результатом.

### Границы изменений

- Для создания и изменения экранов используй `design-system use`.
- Не меняй общие компоненты, их контракты, токены, тему или общие правила ради
  одного экрана без явно разрешённой работы над дизайн-системой.
- Работа над общими возможностями относится к `design-system craft`.
  Если разрешены оба вида работы, выполняй: craft → проверки → use → проверки.
- Уже выданное разрешение действует: не запрашивай его повторно на каждом шаге.
- Дизайн-задача сама по себе не разрешает менять сетевые запросы, сохранение,
  права доступа, бизнес-валидацию и внутреннюю логику компонентов. Такие изменения
  выполняй только в рамках соответствующей продуктовой задачи.
- Не включай посторонние рефакторинги и массовые миграции в локальное изменение.

### Выбор и использование UI

- Для нового экрана сначала ищи подходящий паттерн, затем layout и компоненты.
  Выбирай по назначению и ограничениям контракта, а не только по внешнему виду.
- Для выбора документированных компонентов используй индексы и публичные
  контракты. Исходники читай, когда это требуется для диагностики, craft,
  проверки фактического поведения или допустимого undocumented fallback.
- При создании экрана проверь каталог
  [Shadcn Studio Illustrations](https://shadcnstudio.com/illustrations) и выбери
  иллюстрацию, если она подходит задаче и стеку проекта. Перед добавлением
  проверь, нужны ли новые зависимости, как устанавливается компонент, сколько он
  стоит и какая у него лицензия. Не используй иллюстрацию в плотном рабочем
  сценарии, если она отвлекает пользователя от действий.
- Используй существующий UI-стек и публичные inputs/props, outputs/events,
  slots и варианты. Не устанавливай второй UI-kit ради отдельного элемента.
- Не копируй общий компонент в экран и не обходи его API через внутренний DOM,
  приватные CSS-селекторы или недокументированные переопределения.
- Применяй семантические токены в предназначенных для них ролях.
  Совпадение значений не делает токены взаимозаменяемыми.
- Локальная композиция из разрешённых элементов допустима; не создавай общий
  компонент, wrapper или контракт для каждого одноразового блока разметки.
- При отсутствии подходящей возможности зафиксируй системный пробел.
  Используй допустимый локальный fallback или продолжай независимую работу;
  не вводи новую общую разновидность компонента без craft-scope.

### Исключения и журнал

- Используй только существующий документированный механизм исключений.
  Не придумывай `designSystemException` или другой API, которого в проекте нет.
- Каждое исключение и подавление design-lint должно иметь конкретную причину,
  ограниченную область, необходимое разрешение и ссылку на запись в журнале.
- В записи сохраняй место использования, потребность, фактический и ожидаемый
  результат, затронутое правило, доказательства и следующий шаг.
- Объяснение, запись в журнале или lint-disable не являются разрешением.
  Не переноси локальное исключение на другие экраны как обычный паттерн.
- Не отключай правило целиком и не расширяй ignore-пути, чтобы пройти проверку.
- Закрывай пробел после проверки исходного ожидаемого результата. Сохраняй полную
  запись и основание закрытия в архиве, а не удаляй историю.

### Изменения дизайн-системы

- Перед изменением общего API или токена найди затронутые использования.
  Определи совместимость, значения по умолчанию и необходимую миграцию.
- В том же изменении актуализируй затронутые контракты и проверки. Различай
  назначение компонента, допустимое использование и фактически доказанное поведение.
- Генерируй индексы из контрактов; не редактируй сгенерированные записи вручную.
- Обновляй `sourcesHash` только после проверки исходников относительно контракта.
  Обновление одного хеша допустимо, если проверка доказала неизменность обещаний.
  Нельзя обновлять хеш только ради устранения ошибки проверки.
- Не ослабляй контракт, чтобы скрыть дефект реализации.

### Проверка и завершение

- Выполняй применимые проверки из `DESIGN.md` и процесса проекта: статический
  анализ, типы, тесты, контракты и актуальность индексов. Не выдумывай их команды.
- Проверяй изменённый UI в браузере принятым инструментом проекта. Проверяй
  применимые состояния, клавиатуру, фокус, подписи, ошибки, размеры экрана и темы.
- Явное требование проекта: проверяй контраст затронутого UI, включая используемые
  в нём существующие компоненты и сочетания из Figma. Не скрывай найденную проблему
  только из-за происхождения цветов. Не меняй общую палитру вне разрешённого scope.
- Обязательные проверки проекта не становятся необязательными из-за настроек
  стороннего скилла. Пропуск требует явного решения пользователя или принятой
  политики проекта; недоступная проверка не считается пройденной.
- Сборка не доказывает корректность UI; DOM-тест не доказывает браузерную раскладку;
  скриншот не доказывает поведение с клавиатуры.
- В результате укажи изменения, реально выполненные проверки и их исход,
  невыполненные обязательные проверки с причиной, найденные дефекты и исключения.
  Не заявляй полную проверку интерфейса без соответствующих доказательств.

## Delegated identity and application access

- For authorized Keycloak administration, browser SSO, and Teleport tasks, use
  `skills/devops/security/delegated-access/SKILL.md`. Prefer the existing local
  `keycloak-agent`, `sso-agent`, and `tsh` workflows when installed and documented.
- Discover the approved realm, endpoints, identity files, and authorization
  requirements from local instructions. This repository does not provision a
  software passkey or grant access merely by installing a skill.
- Keycloak administration tokens are for realm management; applications complete
  their own native SSO and issue their own sessions or certificates.
- Keep credentials private, serialize shared authentication-browser workflows,
  and use the product-native collaborative browser for ordinary UI inspection
  when available. Authentication is limited to the user's authorized task.
