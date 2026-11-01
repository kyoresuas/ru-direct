(() => {
  "use strict";

  // Координаты репозитория
  const REPO = "kyoresuas/ru-direct";

  /**
   * Ссылка на файл последнего релиза, без кэша
   */
  const releaseUrl = (file) =>
    `https://github.com/${REPO}/releases/latest/download/${file}`;

  /**
   * Ссылка через CDN для подписок в клиентах
   */
  const cdnUrl = (file) =>
    `https://cdn.jsdelivr.net/gh/${REPO}@release/${file}`;

  /**
   * Ссылка на файл ветки release, запасной источник
   */
  const rawUrl = (file) =>
    `https://raw.githubusercontent.com/${REPO}/release/${file}`;

  // Резолверы DNS-over-HTTPS для проверки домена
  const DOH = [
    "https://cloudflare-dns.com/dns-query",
    "https://dns.google/resolve",
  ];

  // Сколько адресов домена показывать в проверке
  const CHECK_LIMIT = 6;

  // Уровни списков, зеркало src/contracts/tiers
  const TIERS = [
    {
      id: "ru-lite",
      title: "Lite",
      limit: 500,
      hint: "Банки, платежи, госуслуги и соцсети",
    },
    {
      id: "ru-standard",
      title: "Standard",
      limit: 2000,
      hint: "Плюс Ozon, Wildberries, Яндекс, Авито, операторы и стриминги",
    },
    {
      id: "ru-full",
      title: "Full",
      limit: null,
      hint: "Вся российская зона. Только для роутеров и десктопов",
    },
  ];

  // Клиенты
  const CLIENTS = [
    {
      id: "amnezia",
      title: "AmneziaVPN",
      apps: "Android, iOS, Windows, macOS",
      file: (t) => `${t}.amnezia.json`,
      extra: [
        {
          title: "с доменами для десктопа",
          file: (t) => `${t}.amnezia-domains.json`,
        },
      ],
      steps: [
        "Скачайте файл на устройство",
        "Подключение → Настройки подключения → Split Tunneling → Site-based",
        "Режим «Адреса из списка не идут через VPN»",
        "⋮ → Import → Replace site list, выберите файл и переподключитесь",
      ],
    },
    {
      id: "wireguard",
      title: "WireGuard",
      apps: "AmneziaWG, WireGuard",
      file: (t) => `${t}.wireguard-inverted.txt`,
      extra: [
        {
          title: "только Россия через туннель",
          file: (t) => `${t}.wireguard.txt`,
        },
      ],
      steps: [
        "Откройте конфиг туннеля",
        "В секции [Peer] замените AllowedIPs строками из файла",
        "Сохраните и переподключитесь",
      ],
    },
    {
      id: "singbox",
      title: "sing-box",
      apps: "Hiddify, NekoBox, Karing, Throne, Podkop",
      file: (t) => `${t}.singbox.srs`,
      extra: [{ title: "source JSON", file: (t) => `${t}.singbox.json` }],
      steps: ["Добавьте remote rule-set с этой ссылкой и правило direct"],
      snippet: (t, url) =>
        [
          "{",
          '  "route": {',
          `    "rules": [{ "rule_set": ["${t}"], "outbound": "direct" }],`,
          `    "rule_set": [{ "type": "remote", "tag": "${t}", "format": "binary", "url": "${url}" }]`,
          "  }",
          "}",
        ].join("\n"),
    },
    {
      id: "xray",
      title: "Xray",
      apps: "v2rayN, v2rayNG, Happ, Streisand",
      file: () => "geoip.dat",
      extra: [
        { title: "geosite.dat", file: () => "geosite.dat" },
        { title: "правила v2rayN", file: (t) => `${t}.v2rayn.json` },
        { title: "профиль Happ", file: (t) => `${t}.happ.json` },
      ],
      steps: [
        "Положите geoip.dat и geosite.dat в каталог ресурсов клиента",
        "В правилах маршрутизации используйте теги ниже с outbound direct",
      ],
      snippet: (t) => `geoip:${t}\ngeosite:${t}`,
    },
    {
      id: "clash",
      title: "Clash",
      apps: "Mihomo, Clash Verge, FlClash",
      file: (t) => `${t}.mihomo.mrs`,
      extra: [
        { title: "YAML ipcidr", file: (t) => `${t}.mihomo.yaml` },
        { title: "YAML classical", file: (t) => `${t}.clash.yaml` },
      ],
      steps: ["Добавьте rule-provider и правило RULE-SET с политикой DIRECT"],
      snippet: (t, url) =>
        [
          "rule-providers:",
          `  ${t}:`,
          "    type: http",
          "    behavior: ipcidr",
          "    format: mrs",
          `    url: "${url}"`,
          "    interval: 86400",
          "rules:",
          `  - RULE-SET,${t},DIRECT,no-resolve`,
        ].join("\n"),
    },
    {
      id: "surge",
      title: "Shadowrocket",
      apps: "Surge, Loon",
      file: (t) => `${t}.surge.list`,
      steps: ["Rules → + → RULE-SET, вставьте ссылку, политика DIRECT"],
      snippet: (_, url) => `RULE-SET,${url},DIRECT,no-resolve`,
    },
    {
      id: "quantumultx",
      title: "Quantumult X",
      apps: "iOS",
      file: (t) => `${t}.quantumultx.list`,
      steps: ["Settings → Rules → Filter remote → +, вставьте ссылку"],
    },
    {
      id: "mikrotik",
      title: "MikroTik",
      apps: "RouterOS",
      file: (t) => `${t}.mikrotik.rsc`,
      extra: [{ title: "IPv6", file: (t) => `${t}.mikrotik-ipv6.rsc` }],
      steps: [
        "Скачайте скрипт на роутер и импортируйте, address-list пересоздаётся",
      ],
      snippet: (t, url) =>
        `/tool fetch url="${url}" dst-path=${t}.mikrotik.rsc\n/import file-name=${t}.mikrotik.rsc`,
    },
    {
      id: "keenetic",
      title: "Keenetic",
      apps: "KeeneticOS",
      file: (t) => `${t}.keenetic.bat`,
      extra: [{ title: "команды CLI", file: (t) => `${t}.keenetic-cli.txt` }],
      steps: [
        "Маршрутизация → Загрузить из файла, выберите файл и интерфейс провайдера",
      ],
    },
    {
      id: "openwrt",
      title: "OpenWrt",
      apps: "fw4, dnsmasq",
      file: (t) => `${t}.openwrt.nft`,
      extra: [{ title: "dnsmasq nftset", file: (t) => `${t}.dnsmasq.conf` }],
      steps: [
        "Примените набор командой ниже, затем добавьте правило policy routing",
      ],
      snippet: (t, url) =>
        `wget -O /tmp/${t}.nft "${url}"\nnft -f /tmp/${t}.nft`,
    },
    {
      id: "desktop",
      title: "Windows",
      apps: "route add",
      file: (t) => `${t}.windows.bat`,
      extra: [],
      steps: [
        "Откройте командную строку от администратора",
        "Запустите файл, передав адрес шлюза провайдера аргументом. Маршруты действуют до перезагрузки",
      ],
    },
    {
      id: "text",
      title: "Просто списки",
      apps: "ipset, скрипты",
      file: (t) => `${t}.ipv4.txt`,
      extra: [
        { title: "IPv6", file: (t) => `${t}.ipv6.txt` },
        { title: "домены", file: (t) => `${t}.domains.txt` },
      ],
      steps: ["Подсети по строке без комментариев"],
    },
  ];

  // Отдельные клиенты используют форматы соответствующих движков
  CLIENTS.push(...[
    { id: "linux", base: "desktop", title: "Linux", apps: "ip route", file: (t) => `${t}.linux.sh`, extra: [], steps: ["Откройте терминал в папке со скачанным файлом", "Запустите sudo sh имя-файла шлюз-IPv4. Вторым аргументом можно передать шлюз IPv6"] },
    { id: "macos", base: "desktop", title: "macOS", apps: "route", file: (t) => `${t}.macos.sh`, extra: [], steps: ["Откройте терминал в папке со скачанным файлом", "Запустите sudo sh имя-файла шлюз-IPv4. Вторым аргументом можно передать шлюз IPv6"] },
    { id: "happ", base: "xray", title: "Happ", apps: "Android, iOS, Windows, macOS", file: (t) => `${t}.happ.json`, extra: [], steps: ["Скачайте профиль маршрутизации", "Импортируйте его в разделе маршрутизации Happ и включите профиль"], snippet: null },
    { id: "hiddify", base: "singbox", title: "Hiddify", apps: "sing-box" },
    { id: "karing", base: "singbox", title: "Karing", apps: "sing-box" },
    { id: "nekobox", base: "singbox", title: "NekoBox", apps: "Android, sing-box" },
    { id: "throne", base: "singbox", title: "Throne", apps: "Windows, Linux, macOS" },
    { id: "v2rayn", base: "xray", title: "v2rayN", apps: "Xray", file: (t) => `${t}.v2rayn.json`, extra: [], steps: ["Скопируйте содержимое JSON-файла", "Откройте настройки маршрутизации v2rayN и импортируйте правила из буфера обмена"], snippet: null },
    { id: "v2rayng", base: "xray", title: "v2rayNG", apps: "Android, Xray" },
    { id: "streisand", base: "xray", title: "Streisand", apps: "iOS, Xray" },
    { id: "clashverge", base: "clash", title: "Clash Verge Rev", apps: "Windows, Linux, macOS" },
    { id: "flclash", base: "clash", title: "FlClash", apps: "Mihomo" },
    { id: "surge-app", base: "surge", title: "Surge", apps: "iOS, macOS" },
    { id: "loon", base: "surge", title: "Loon", apps: "iOS" },
  ].map((item) => ({ ...CLIENTS.find((client) => client.id === item.base), ...item })));

  // Выбор пользователя и загруженные данные
  const state = { client: "amnezia", tier: "ru-lite", manifest: null, services: null, allClients: false, selectionWarning: "", selectionHash: "" };
  const selected = new Set();
  const ranges = new Map();
  let checkRunning = false;

  /** Найти элемент страницы */
  const $ = (selector) => document.querySelector(selector);

  /** Создать элемент с безопасным текстом */
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === "text") node.textContent = value;
      else if (value !== null && value !== undefined) node.setAttribute(key, value);
    }
    for (const child of children) if (child) node.append(child);
    return node;
  };

  /** Загрузить данные с резервным источником и ограничением ожидания */
  const loadData = async (file, type = "json") => {
    for (const url of [rawUrl, cdnUrl]) {
      try {
        const response = await fetch(url(file), { cache: "no-cache", signal: AbortSignal.timeout(8000) });
        if (response.ok) return await response[type]();
      } catch {
        // Пробуем резервный источник
      }
    }
    throw new Error("Источники списков недоступны. Попробуйте ещё раз позже");
  };

  /** Восстановить выбор, параметры ссылки важнее сохранённых настроек */
  const restore = () => {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem("ru-direct") || "{}") || {}; } catch { /* Хранилище недоступно */ }
    const params = new URLSearchParams(location.search);
    const client = params.get("client") || saved.client;
    const tier = params.get("tier") || saved.tier;
    if (CLIENTS.some((item) => item.id === client)) state.client = client;
    if (TIERS.some((item) => item.id === tier)) state.tier = tier;
  };

  /** Запомнить выбор без зависимости от доступности хранилища */
  const persist = () => {
    try { localStorage.setItem("ru-direct", JSON.stringify({ client: state.client, tier: state.tier })); } catch { /* Хранилище недоступно */ }
  };

  /** Число с русским склонением подписи */
  const countLabel = (count, forms) => `${count} ${forms[new Intl.PluralRules("ru").select(count)] || forms.many}`;

  /** Кнопка копирования с понятным результатом */
  const copyButton = (label, getText, className = "btn") => {
    const button = el("button", { class: className, type: "button", text: label });
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(getText());
        button.textContent = "Скопировано";
      } catch {
        button.textContent = "Не удалось скопировать";
      }
      setTimeout(() => { button.textContent = label; }, 1800);
    });
    return button;
  };

  /** Радиогруппа с навигацией стрелками и сохранением фокуса */
  const renderGroup = (box, items, current, className, renderItem, onPick) => {
    const focused = box.contains(document.activeElement);
    box.replaceChildren();
    for (const item of items) {
      const button = el("button", { class: className, type: "button", role: "radio", "aria-checked": String(item.id === current), tabindex: item.id === current ? "0" : "-1" });
      renderItem(button, item);
      button.addEventListener("click", () => onPick(item.id));
      button.addEventListener("keydown", (event) => {
        const buttons = [...box.querySelectorAll('[role="radio"]')].filter((node) => !node.hidden);
        const index = buttons.indexOf(button);
        let next;
        if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % buttons.length;
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        buttons[next].click();
      });
      box.append(button);
    }
    if (focused) box.querySelector('[aria-checked="true"]')?.focus();
  };

  /** Найти клиент по названию или совместимому приложению */
  const filterClients = () => {
    const query = $("#client-search").value.trim().toLowerCase();
    const buttons = [...$("#clients").children];
    const featured = ["amnezia", "wireguard", "happ", "hiddify", "karing", "clash", "mikrotik", "openwrt"];
    if (!featured.includes(state.client)) featured[featured.length - 1] = state.client;
    let first = null;
    for (let i = 0; i < CLIENTS.length; i++) {
      const client = CLIENTS[i];
      const button = buttons[i];
      button.hidden = query
        ? !`${client.title} ${client.apps}`.toLowerCase().includes(query)
        : !state.allClients && !featured.includes(client.id);
      button.tabIndex = -1;
      if (!button.hidden && !first) first = button;
    }
    const current = buttons.find((button) => !button.hidden && button.getAttribute("aria-checked") === "true");
    if (current || first) (current || first).tabIndex = 0;
    $("#client-empty").hidden = Boolean(first);
    $("#all-clients").hidden = Boolean(query);
    $("#all-clients").textContent = state.allClients ? "Свернуть" : `Все клиенты (${CLIENTS.length})`;
    $("#all-clients").setAttribute("aria-expanded", String(state.allClients));
  };

  /** Число подсетей из манифеста или обозначение лимита */
  const tierCount = (tier) => {
    const stats = state.manifest?.tiers?.[tier.id];
    if (stats) return `${new Intl.NumberFormat("ru-RU").format(stats.ipv4)} IPv4`;
    return tier.limit ? `до ${tier.limit} IPv4` : "Вся зона RU";
  };

  /** Отрисовать выбор и скачивание без сброса поискового запроса */
  const render = () => {
    const client = CLIENTS.find((item) => item.id === state.client);
    const tier = TIERS.find((item) => item.id === state.tier);
    renderGroup($("#clients"), CLIENTS, client.id, "option", (button, item) => {
      button.append(document.createTextNode(item.title));
      button.title = item.apps;
    }, (id) => { state.client = id; persist(); render(); });
    filterClients();
    renderGroup($("#tiers"), TIERS, tier.id, "segment", (button, item) => {
      button.append(document.createTextNode(item.title), el("span", { text: tierCount(item) }));
    }, (id) => { state.tier = id; persist(); render(); });
    $("#tier-hint").textContent = tier.hint;
    const file = client.file(tier.id);
    const link = cdnUrl(file);
    const result = $("#result");
    result.replaceChildren();
    const stats = state.manifest?.tiers?.[tier.id];
    const metadata = [...(stats?.files || []), ...(state.manifest?.shared || [])].find((item) => item.name === file);
    result.append(el("div", { class: "actions" }, [el("a", { class: "btn primary", href: releaseUrl(file), download: file, title: file, text: "Скачать список" }), copyButton("Ссылка", () => link)]));
    if (state.client === "amnezia" && state.tier === "ru-full") result.append(el("p", { class: "hint", text: "Тысячи маршрутов могут замедлить подключение. Для телефона начните с Lite" }));
    const instructions = el("details", {}, [
      el("summary", { text: "Как подключить" }),
      client.steps.length === 1
        ? el("p", { class: "steps single", text: client.steps[0] })
        : el("ol", { class: "steps" }, client.steps.map((text) => el("li", { text }))),
    ]);
    if (client.snippet) {
      const snippet = client.snippet(tier.id, link);
      instructions.append(el("pre", {}, [el("code", { text: snippet })]), copyButton("Копировать пример", () => snippet, "btn snippet-copy"));
    }
    result.append(instructions);
    if (client.extra?.length) {
      result.append(el("details", {}, [el("summary", { text: "Другие форматы" }), ...client.extra.map((item) => el("div", { class: "extra-file" }, [el("span", { text: item.title }), el("a", { class: "btn", href: releaseUrl(item.file(tier.id)), text: "Скачать" }), copyButton("Ссылка", () => cdnUrl(item.file(tier.id)))]))]));
    }
    if (metadata) result.append(el("details", {}, [el("summary", { text: "Проверить SHA-256" }), el("pre", {}, [el("code", { text: metadata.sha256 })]), copyButton("Копировать SHA-256", () => metadata.sha256, "btn snippet-copy")]));
    $("#share-link").replaceChildren(copyButton("Поделиться настройками", () => {
      const url = new URL(location.href);
      url.search = new URLSearchParams({ client: state.client, tier: state.tier }).toString();
      url.hash = "setup";
      return url.href;
    }, "text-button"));
  };

  /** Показать дату именно опубликованных данных */
  const loadManifest = async () => {
    const status = $("#build-status");
    try {
      const manifest = await loadData("manifest.json");
      const date = new Date(manifest.generatedAt);
      if (!Number.isFinite(date.getTime()) || !TIERS.every((tier) => Number.isInteger(manifest.tiers?.[tier.id]?.ipv4))) throw new Error("Некорректный манифест");
      state.manifest = manifest;
      const stale = Date.now() - date.getTime() > 3 * 86400000;
      status.dataset.status = stale ? "stale" : "ready";
      status.replaceChildren(document.createTextNode(`Списки от ${new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(date)}`), el("span", { "aria-hidden": "true", text: "·" }), el("a", { href: `https://github.com/${REPO}/actions/workflows/update.yml`, text: stale ? "Проверить обновления" : "История обновлений" }));
      render();
    } catch {
      status.textContent = "Дата списков недоступна. Скачивание доступно в GitHub Releases";
    }
  };

  /** IPv4 в число или null для неверного адреса */
  const ip4ToInt = (ip) => {
    const parts = ip.split(".");
    if (parts.length !== 4) return null;
    let value = 0;
    for (const part of parts) {
      if (!/^\d{1,3}$/.test(part) || Number(part) > 255) return null;
      value = value * 256 + Number(part);
    }
    return value;
  };

  /** IP в число с проверкой синтаксиса IPv6 встроенным URL-парсером */
  const ipToValue = (ip) => {
    if (!ip.includes(":")) {
      const value = ip4ToInt(ip);
      return value === null ? null : { value: BigInt(value), bits: 32 };
    }
    try {
      const canonical = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
      const [head, tail] = canonical.split("::");
      const left = head ? head.split(":") : [];
      const right = tail ? tail.split(":") : [];
      const groups = tail === undefined ? left : [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];
      return { value: groups.reduce((value, group) => (value << 16n) | BigInt(`0x${group}`), 0n), bits: 128 };
    } catch { return null; }
  };

  /** Загрузить корректные непересекающиеся диапазоны одного семейства */
  const loadRanges = async (tier, bits) => {
    const key = `${tier}:${bits}`;
    if (ranges.has(key)) return ranges.get(key);
    const text = await loadData(`${tier}.ipv${bits === 32 ? 4 : 6}.txt`, "text");
    const list = [];
    for (const line of text.split("\n").filter((item) => item.trim())) {
      const cidr = line.trim();
      const [ip, prefix] = cidr.split("/");
      const parsed = ipToValue(ip);
      if (!parsed || parsed.bits !== bits || !/^\d+$/.test(prefix || "") || Number(prefix) > bits) throw new Error("Некорректный список подсетей");
      const size = 1n << BigInt(bits - Number(prefix));
      const start = parsed.value / size * size;
      list.push({ start, end: start + size - 1n, cidr });
    }
    list.sort((a, b) => a.start < b.start ? -1 : a.start > b.start ? 1 : 0);
    ranges.set(key, list);
    return list;
  };

  /** Найти диапазон бинарным поиском */
  const findRange = (list, value) => {
    let low = 0;
    let high = list.length - 1;
    let found = null;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (list[mid].start <= value) { found = list[mid]; low = mid + 1; }
      else high = mid - 1;
    }
    return found && found.end >= value ? found.cidr : null;
  };

  /** Получить A и AAAA с резервным DNS-провайдером */
  const resolveDomain = async (domain) => {
    for (const base of DOH) {
      try {
        const answers = await Promise.all(["A", "AAAA"].map(async (type) => {
          const response = await fetch(`${base}?name=${encodeURIComponent(domain)}&type=${type}`, { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(6000) });
          if (!response.ok) throw new Error("DNS недоступен");
          const json = await response.json();
          if (![0, 3].includes(json.Status)) throw new Error("Ошибка DNS");
          return (json.Answer || []).filter((answer) => answer.type === (type === "A" ? 1 : 28) && ipToValue(answer.data)).map((answer) => answer.data);
        }));
        return [...new Set(answers.flat())];
      } catch { /* Пробуем резервный DNS */ }
    }
    throw new Error("DNS недоступен. Попробуйте ввести IP-адрес");
  };

  /** Таблица вхождения адреса без обещания фактического маршрута клиента */
  const verdictCard = async (ip) => {
    const parsed = ipToValue(ip);
    const table = el("table", { "aria-label": `Вхождение ${ip} в IP-списки` });
    for (const tier of TIERS) {
      const match = findRange(await loadRanges(tier.id, parsed.bits), parsed.value);
      table.append(el("tr", {}, [el("th", { scope: "row", text: tier.title }), el("td", { class: match ? "yes" : "no", text: match ? `В списке · ${match}` : "Нет в IP-списке" })]));
    }
    return el("div", { class: "verdict" }, [el("h3", { text: ip }), table]);
  };

  /** Проверить домен, URL или адрес с защитой от повторной отправки */
  const onCheck = async (event) => {
    event.preventDefault();
    if (checkRunning) return;
    const box = $("#check-result");
    const button = $("#check-form button");
    checkRunning = true;
    button.disabled = true;
    button.textContent = "Проверяем…";
    box.setAttribute("aria-busy", "true");
    box.replaceChildren();
    try {
      const input = $("#check-input").value.trim();
      let target = input.replace(/^\[([^\]]+)\]$/, "$1");
      if (!ipToValue(target)) {
        const url = new URL(input.includes("://") ? input : `https://${input}`);
        if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("Введите домен, IP-адрес или ссылку без логина и пароля");
        target = url.hostname.replace(/^\[|\]$/g, "");
        if (!ipToValue(target) && (!target.includes(".") || !/^[a-z0-9.-]+$/i.test(target))) throw new Error("Введите корректный домен или IP-адрес");
      }
      const ips = ipToValue(target) ? [target] : await resolveDomain(target);
      if (!ips.length) throw new Error("У домена нет адресов A или AAAA");
      const visible = ips.slice(0, CHECK_LIMIT);
      const families = [...new Set(visible.map((ip) => ipToValue(ip).bits))];
      await Promise.all(TIERS.flatMap((tier) => families.map((bits) => loadRanges(tier.id, bits))));
      const cards = await Promise.all(visible.map(verdictCard));
      box.replaceChildren(...cards, el("p", { class: "hint", text: `Проверено адресов: ${Math.min(ips.length, CHECK_LIMIT)} из ${ips.length}. Это проверка IP-списков, а не вашего VPN-подключения. Доменные правила клиента и DNS провайдера могут дать другой результат` }));
    } catch (error) {
      box.replaceChildren(el("p", { class: "hint", text: error instanceof TypeError ? "Введите корректный домен, URL или IP-адрес" : error.message }));
    } finally {
      checkRunning = false;
      button.disabled = false;
      button.textContent = "Проверить";
      box.setAttribute("aria-busy", "false");
    }
  };

  /** Обновить размер персонального списка без потери фокуса */
  const updateSelection = () => {
    const services = state.services.categories.flatMap((category) => category.services).filter((service) => selected.has(service.name));
    const format = $("#custom-format").value;
    const cidrs = new Set(services.flatMap((service) => format === "ipv6" ? service.ipv6 : service.ipv4));
    $("#selection-status").textContent = `${countLabel(services.length, { one: "сервис", few: "сервиса", many: "сервисов" })} · ${countLabel(cidrs.size, { one: "подсеть", few: "подсети", many: "подсетей" })}`;
    if (!services.length) $("#selection-status").textContent = "Выберите сервисы";
    $("#custom-download").disabled = !cidrs.size;
    $("#selection-clear").hidden = !selected.size;
    $("#custom-share button").disabled = !selected.size;
  };

  /** Ссылка с версией формата и выбранными сервисами, фрагмент не отправляется серверу */
  const selectionUrl = () => {
    const url = new URL(location.href);
    url.search = "";
    url.hash = "services?" + new URLSearchParams({
      v: "1",
      format: $("#custom-format").value,
      services: JSON.stringify([...selected].sort()),
    }).toString();
    return url.href;
  };

  /** Восстановить персональный набор по текущему каталогу */
  const restoreSelection = () => {
    if (!location.hash.startsWith("#services?")) {
      state.selectionHash = "";
      return;
    }
    if (state.selectionHash === location.hash) return;
    state.selectionHash = location.hash;
    $("#service-search").value = "";
    selected.clear();
    state.selectionWarning = "";
    try {
      if (location.hash.length > 32768) throw new Error("Слишком длинная ссылка на набор");
      const params = new URLSearchParams(location.hash.slice("#services?".length));
      if (params.get("v") !== "1") throw new Error("Эта версия ссылки на набор не поддерживается");
      const format = params.get("format");
      if (!["amnezia", "ipv4", "ipv6"].includes(format)) throw new Error("В ссылке указан неизвестный формат");
      const names = JSON.parse(params.get("services") || "null");
      if (!Array.isArray(names) || names.length > 500 || names.some((name) => typeof name !== "string" || !name || name.length > 128)) throw new Error("Некорректный список сервисов в ссылке");
      const available = new Set(state.services.categories.flatMap((category) => category.services.map((service) => service.name)));
      const missing = new Set();
      for (const name of names) {
        if (available.has(name)) selected.add(name);
        else missing.add(name);
      }
      $("#custom-format").value = format;
      if (missing.size) state.selectionWarning = `Сервисы из ссылки отсутствуют в каталоге: ${[...missing].join(", ")}`;
    } catch (error) {
      state.selectionWarning = error.message;
    }
  };

  /** Нарисовать каталог и флажки персонального списка */
  const renderServices = () => {
    const query = $("#service-search").value.trim().toLowerCase();
    const list = $("#service-list");
    list.replaceChildren();
    let count = 0;
    for (const category of state.services.categories) {
      const services = category.services.filter((service) => `${service.name} ${category.title} ${service.apps.join(" ")}`.toLowerCase().includes(query));
      if (!services.length) continue;
      const grid = el("div", { class: "service-grid" });
      for (const service of services) {
        const input = el("input", { type: "checkbox", "aria-label": service.name });
        input.checked = selected.has(service.name);
        input.addEventListener("change", () => {
          if (input.checked) selected.add(service.name);
          else selected.delete(service.name);
          updateSelection();
        });
        grid.append(el("label", { class: "service-item" }, [input, el("span", { text: service.name }), el("small", { text: service.tier === "lite" ? "Lite" : "Standard" })]));
      }
      count += services.length;
      list.append(el("div", { class: "service-category" }, [el("h3", { text: category.title }), grid]));
    }
    const hint = query ? `Найдено: ${count}` : "Отметьте нужные сервисы. Персональный список обновляется вручную";
    $("#service-status").textContent = state.selectionWarning ? `${state.selectionWarning}. ${hint}` : hint;
    updateSelection();
  };

  /** Загрузить каталог при открытии, старый формат не использовать для экспорта */
  const loadServices = async () => {
    if (state.services) {
      if (!$("#builder-actions").hidden) {
        restoreSelection();
        renderServices();
      }
      return;
    }
    if ($("#services-details").dataset.loading === "true") return;
    const status = $("#service-status");
    $("#services-details").dataset.loading = "true";
    status.textContent = "Загружаем сервисы…";
    try {
      const data = await loadData("services.json");
      if (!Array.isArray(data.categories)) throw new Error("Некорректный каталог");
      const services = data.categories.flatMap((category) => category.services);
      state.services = data;
      $("#services-count").textContent = countLabel(services.length, { one: "сервис", few: "сервиса", many: "сервисов" });
      const ready = services.every((service) => Array.isArray(service.ipv4) && Array.isArray(service.ipv6));
      $("#builder-actions").hidden = !ready;
      if (!ready) {
        status.textContent = "Конструктор появится после следующей публикации данных. Сейчас доступны готовые уровни выше";
        for (const category of data.categories) $("#service-list").append(el("p", { class: "hint", text: `${category.title}: ${category.services.map((service) => service.name).join(", ")}` }));
        return;
      }
      restoreSelection();
      renderServices();
    } catch {
      status.replaceChildren(document.createTextNode("Каталог недоступен. "));
      const retry = el("button", { type: "button", class: "text-button", text: "Повторить" });
      retry.addEventListener("click", loadServices);
      status.append(retry);
    } finally { $("#services-details").dataset.loading = "false"; }
  };

  /** Скачать персональный IP-список, не создавая внешних запросов */
  const downloadCustom = () => {
    const services = state.services.categories.flatMap((category) => category.services).filter((service) => selected.has(service.name));
    const format = $("#custom-format").value;
    const cidrs = [...new Set(services.flatMap((service) => format === "ipv6" ? service.ipv6 : service.ipv4))];
    if (!cidrs.length) return;
    const content = format === "amnezia" ? JSON.stringify(cidrs.map((hostname) => ({ hostname, ip: "" }))) : cidrs.join("\n") + "\n";
    const url = URL.createObjectURL(new Blob([content], { type: format === "amnezia" ? "application/json" : "text/plain" }));
    const link = el("a", { href: url, download: `ru-custom.${format === "amnezia" ? "amnezia.json" : `${format}.txt`}` });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /** Переключить готовый список и конструктор, сохранив выбор сервисов */
  const setMode = (custom) => {
    $("#preset-panel").hidden = custom;
    $("#services").hidden = !custom;
    for (const [id, active] of [["preset-tab", !custom], ["custom-tab", custom]]) {
      $("#" + id).setAttribute("aria-selected", String(active));
      $("#" + id).tabIndex = active ? 0 : -1;
    }
    if (custom) loadServices();
  };

  restore();
  $("#custom-share").append(copyButton("Сохранить набор ссылкой", selectionUrl, "text-button"));
  $("#custom-share button").disabled = true;
  render();
  loadManifest();
  $("#client-search").addEventListener("input", filterClients);
  $("#all-clients").addEventListener("click", () => { state.allClients = !state.allClients; filterClients(); });
  $("#check-form").addEventListener("submit", onCheck);
  for (const id of ["preset-tab", "custom-tab"]) {
    const button = $("#" + id);
    button.addEventListener("click", () => setMode(id === "custom-tab"));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const custom = event.key === "Home" ? false : event.key === "End" ? true : id === "preset-tab";
      setMode(custom);
      $(custom ? "#custom-tab" : "#preset-tab").focus();
    });
  }
  setMode(location.hash === "#services" || location.hash.startsWith("#services?"));
  addEventListener("hashchange", () => { if (location.hash === "#services" || location.hash.startsWith("#services?")) setMode(true); });
  $("#service-search").addEventListener("input", () => { if (state.services && !$("#builder-actions").hidden) renderServices(); });
  $("#custom-format").addEventListener("change", updateSelection);
  $("#custom-download").addEventListener("click", downloadCustom);
  $("#selection-clear").addEventListener("click", () => { selected.clear(); renderServices(); });
})();
