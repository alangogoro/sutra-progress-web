import { getAllSutras, getSutra, updateSutraProgress, getSettings, saveSettings, saveSutra, deleteSutra, type Sutra } from "./db/db";
import "./styles/base.css";

type Page = "home" | "sutra-detail" | "settings" | "sutra-edit";

const app = document.querySelector<HTMLElement>("#app") as HTMLElement;

function parseHash(): { page: Page; params: Record<string, string> } {
  const hash = location.hash.slice(1) || "home";
  const [rawPage, query] = hash.split("?") as [string, string | undefined];
  const page = (["home", "sutra-detail", "settings", "sutra-edit"].includes(rawPage) ? rawPage : "home") as Page;
  const params: Record<string, string> = {};
  if (query) {
    for (const pair of query.split("&")) {
      const [k, v] = pair.split("=") as [string, string | undefined];
      if (k && v !== undefined) params[k] = decodeURIComponent(v);
    }
  }
  return { page, params };
}

export function navigate(page: Page, params?: Record<string, string>): void {
  let hash = page;
  if (params) {
    const qs = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    if (qs) hash += `?${qs}`;
  }
  location.hash = hash;
}

async function route(): Promise<void> {
  const { page, params } = parseHash();
  app.innerHTML = "";

  try {
    switch (page) {
      case "home":
        await showHome();
        break;
      case "sutra-detail":
        await showSutraDetail(params["id"] ?? "");
        break;
      case "settings":
        await showSettings();
        break;
      case "sutra-edit":
        await showSutraEdit(params["id"]);
        break;
    }
  } catch (err) {
    console.error("Navigation error:", err);
    app.innerHTML = '<p class="text-muted" style="padding:1rem">載入失敗，請重新整理頁面。</p>';
  }
}

// ─── Utilities ──────────────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function chevronLeftSVG(): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
    <path d="M12 15l-5-5 5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function gearSVG(): string {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function showConfirmDialog(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `
      <div class="confirm-dialog" role="alertdialog" aria-label="確認">
        <p class="confirm-dialog__msg">${escHtml(message)}</p>
        <div class="confirm-dialog__actions">
          <button class="btn-ghost" id="confirm-cancel" type="button">取消</button>
          <button class="btn-primary" id="confirm-ok" type="button">確認</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const cleanup = (result: boolean) => {
      overlay.remove();
      resolve(result);
    };

    overlay.querySelector("#confirm-cancel")!.addEventListener("click", () => cleanup(false));
    overlay.querySelector("#confirm-ok")!.addEventListener("click", () => cleanup(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(false);
    });
  });
}

// ─── Home ───────────────────────────────────────────────────────────────────

async function showHome(): Promise<void> {
  const [sutras, settings] = await Promise.all([getAllSutras(), getSettings()]);
  const greeting = settings.userName
    ? `你好，${escHtml(settings.userName)} 菩薩`
    : "你好，菩薩";

  const cardsHTML = sutras.map((s) => {
    const pct = s.targetCount > 0 ? Math.round((s.completedCount / s.targetCount) * 100) : 0;
    return `
      <button class="sutra-card" data-id="${escHtml(s.id)}" type="button">
        <img class="sutra-card__icon" src="${escHtml(s.icon)}" alt="" width="60" height="60" loading="lazy" />
        <div class="sutra-card__info">
          <span class="sutra-card__name">${escHtml(s.name)}</span>
          <div class="progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
          <span class="sutra-card__count">${s.completedCount}/${s.targetCount}</span>
        </div>
      </button>
    `;
  }).join("");

  app.innerHTML = `
    <div class="page">
      <div class="home-header">
        <span class="home-greeting">${greeting}</span>
        <button class="btn-settings" id="btn-settings" type="button" aria-label="設定">
          ${gearSVG()}
          設定
        </button>
      </div>
      <ul class="sutra-list" aria-label="經文列表">${cardsHTML}</ul>
    </div>
  `;

  app.querySelector("#btn-settings")!.addEventListener("click", () =>
    navigate("settings")
  );

  for (const card of app.querySelectorAll<HTMLButtonElement>(".sutra-card")) {
    card.addEventListener("click", () => {
      const id = card.dataset["id"];
      if (id) navigate("sutra-detail", { id });
    });
  }
}

// ─── Sutra Detail ───────────────────────────────────────────────────────────

async function showSutraDetail(id: string): Promise<void> {
  const sutra = await getSutra(id);
  if (!sutra) {
    navigate("home");
    return;
  }

  renderDetail(sutra);
}

function renderDetail(sutra: Sutra): void {
  const pct = sutra.targetCount > 0 ? Math.round((sutra.completedCount / sutra.targetCount) * 100) : 0;

  app.innerHTML = `
    <div class="page">
      <div class="page-nav">
        <button class="btn-back-nav" id="btn-back" type="button" aria-label="返回首頁">
          ${chevronLeftSVG()}
          返回
        </button>
      </div>
      <div class="detail-hero">
        <img class="detail-hero__icon" src="${escHtml(sutra.icon)}" alt="" width="100" height="100" />
        <h2 class="detail-hero__name">${escHtml(sutra.name)}</h2>
        <div class="progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-fill" style="width: ${pct}%"></div>
        </div>
        <p class="detail-hero__count" aria-label="已完成 ${sutra.completedCount} 部，目標 ${sutra.targetCount} 部">
          ${sutra.completedCount}<span class="detail-hero__count-sep"> / </span><span class="detail-hero__count-max">${sutra.targetCount}</span>
        </p>
      </div>
      <div class="detail-actions">
        <button class="btn-primary" id="btn-inc" type="button" ${sutra.completedCount >= sutra.targetCount ? "disabled" : ""}>加一部</button>
      </div>
    </div>
  `;

  app.querySelector("#btn-back")!.addEventListener("click", () => navigate("home"));

  app.querySelector("#btn-inc")!.addEventListener("click", async () => {
    const confirmed = await showConfirmDialog(`確定要將「${sutra.name}」加一部嗎？`);
    if (confirmed) {
      await updateSutraProgress(sutra.id, 1);
      const updated = await getSutra(sutra.id);
      if (updated) renderDetail(updated);
    }
  });
}

// ─── Settings ───────────────────────────────────────────────────────────────

async function showSettings(): Promise<void> {
  const [settings, sutras] = await Promise.all([getSettings(), getAllSutras()]);

  const sutraListHTML = sutras.map((s) => `
    <button class="settings-sutra-item" data-id="${escHtml(s.id)}" type="button">
      <span>${escHtml(s.name)}</span>
      <span class="sutra-card__count">${s.completedCount}/${s.targetCount}</span>
    </button>
  `).join("");

  app.innerHTML = `
    <div class="page">
      <div class="page-nav">
        <button class="btn-back-nav" id="btn-back" type="button" aria-label="返回首頁">
          ${chevronLeftSVG()}
          返回
        </button>
        <h1 class="page-title">設定</h1>
      </div>
      <div class="settings-form">
        <div class="settings-field">
          <label class="settings-label" for="input-name">使用者名稱</label>
          <input type="text" id="input-name" value="${escHtml(settings.userName)}" placeholder="輸入您的名稱" />
        </div>
        <button class="btn-secondary btn-full" id="btn-save-name" type="button">儲存名稱</button>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <h2 class="page-title">經文管理</h2>
        <button class="btn-primary" id="btn-add-sutra" type="button" style="font-size:var(--font-size-lg);padding:var(--sp-1) var(--sp-3)">新增</button>
      </div>
      <div class="settings-sutra-list">${sutraListHTML}</div>
    </div>
  `;

  app.querySelector("#btn-back")!.addEventListener("click", () => navigate("home"));
  app.querySelector("#btn-save-name")!.addEventListener("click", async () => {
    const name = (app.querySelector<HTMLInputElement>("#input-name")!).value.trim();
    await saveSettings(name);
    const btn = app.querySelector<HTMLButtonElement>("#btn-save-name")!;
    btn.textContent = "已儲存 ✓";
    setTimeout(() => { btn.textContent = "儲存名稱"; }, 1500);
  });
  app.querySelector("#btn-add-sutra")!.addEventListener("click", () => navigate("sutra-edit"));

  for (const item of app.querySelectorAll<HTMLButtonElement>(".settings-sutra-item")) {
    item.addEventListener("click", () => {
      const id = item.dataset["id"];
      if (id) navigate("sutra-edit", { id });
    });
  }
}

// ─── Sutra Edit ─────────────────────────────────────────────────────────────

async function showSutraEdit(id?: string): Promise<void> {
  const existing = id ? await getSutra(id) : undefined;
  const isNew = !existing;
  const title = isNew ? "新增經文" : "編輯經文";

  app.innerHTML = `
    <div class="page">
      <div class="page-nav">
        <button class="btn-back-nav" id="btn-back" type="button" aria-label="返回設定">
          ${chevronLeftSVG()}
          返回
        </button>
        <h1 class="page-title">${title}</h1>
      </div>
      <div class="settings-form">
        <div class="settings-field">
          <label class="settings-label" for="input-sutra-name">經文名稱</label>
          <input type="text" id="input-sutra-name" value="${escHtml(existing?.name ?? "")}" placeholder="例：心經" />
        </div>
        <div class="settings-field">
          <label class="settings-label" for="input-target">目標部數</label>
          <input type="number" id="input-target" value="${existing?.targetCount ?? 1}" min="1" />
        </div>
        <button class="btn-primary btn-full" id="btn-save-sutra" type="button">${isNew ? "新增" : "儲存"}</button>
        ${!isNew ? '<button class="btn-danger btn-full" id="btn-delete-sutra" type="button">刪除此經文</button>' : ""}
      </div>
    </div>
  `;

  app.querySelector("#btn-back")!.addEventListener("click", () => navigate("settings"));

  app.querySelector("#btn-save-sutra")!.addEventListener("click", async () => {
    const name = (app.querySelector<HTMLInputElement>("#input-sutra-name")!).value.trim();
    const targetCount = Math.max(1, parseInt((app.querySelector<HTMLInputElement>("#input-target")!).value, 10) || 1);

    if (!name) return;

    if (existing) {
      const completedCount = Math.min(existing.completedCount, targetCount);
      await saveSutra({ ...existing, name, targetCount, completedCount });
    } else {
      const iconIndex = Math.floor(Math.random() * 10) + 1;
      const icon = `icons/sutra-${String(iconIndex).padStart(2, "0")}.png`;
      const allSutras = await getAllSutras();
      const maxSort = allSutras.reduce((max, s) => Math.max(max, s.sortOrder), 0);
      const newSutra: Sutra = {
        id: crypto.randomUUID(),
        name,
        icon,
        targetCount,
        completedCount: 0,
        sortOrder: maxSort + 1,
      };
      await saveSutra(newSutra);
    }
    navigate("settings");
  });

  const deleteBtn = app.querySelector<HTMLButtonElement>("#btn-delete-sutra");
  if (deleteBtn && existing) {
    deleteBtn.addEventListener("click", async () => {
      const confirmed = await showConfirmDialog(`確定要刪除「${existing.name}」嗎？此操作無法復原。`);
      if (confirmed) {
        await deleteSutra(existing.id);
        navigate("settings");
      }
    });
  }
}

// ─── Boot ───────────────────────────────────────────────────────────────────

window.addEventListener("hashchange", () => route());
route();
