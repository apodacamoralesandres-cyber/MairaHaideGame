export const SAVE_KEY = "mariaHaideIdleLove";
export const SAVE_VERSION = 2;
export const OFFLINE_MIN_SEC = 30;
export const OFFLINE_CAP_SEC = 8 * 60 * 60;
export const MICHI_COST = 800;
/** Lovecoins per second, per Michi level, before multipliers. */
export const MICHI_RATE = 5;

export type UpgradeId = "click" | "mult" | "big" | "offline" | "eternal";

export type Save = {
  version: number;
  coins: number;
  earned: number;
  totalClicks: number;
  upgrades: Record<UpgradeId, number>;
  michi: boolean;
  michiLevel: number;
  achievements: Record<string, boolean>;
  sound: boolean;
  lastSeen: number;
};

export const UPGRADES: {
  id: UpgradeId;
  name: string;
  desc: string;
  base: number;
  scale: number;
}[] = [
  { id: "click", name: "Clicks", desc: "+1 por clic", base: 200, scale: 1.65 },
  { id: "mult", name: "Lovecoins", desc: "×1.5 ganancias por clic", base: 1000, scale: 2.3 },
  { id: "big", name: "Corazón Grande", desc: "+5 por clic", base: 2500, scale: 2 },
  { id: "offline", name: "Gatito Feliz", desc: "×2 ganancias offline", base: 5000, scale: 2.5 },
  { id: "eternal", name: "Amor Eterno", desc: "×5 todas las ganancias", base: 10000, scale: 3.2 },
];

export const ACHIEVEMENTS: {
  id: string;
  name: string;
  goal: number;
  kind: "earned" | "clicks";
  detail: string;
}[] = [
  { id: "first", name: "Primer amor", goal: 100, kind: "earned", detail: "Obtén 100 Lovecoins" },
  { id: "dedicated", name: "Amante dedicado", goal: 1000, kind: "earned", detail: "Obtén 1,000 Lovecoins" },
  { id: "infinite", name: "Amor infinito", goal: 10000, kind: "earned", detail: "Obtén 10,000 Lovecoins" },
  { id: "million", name: "Corazón millonario", goal: 1_000_000, kind: "earned", detail: "Obtén 1,000,000 Lovecoins" },
  { id: "clicker", name: "Amor incansable", goal: 10000, kind: "clicks", detail: "Realiza 10,000 clicks" },
];

export function freshSave(now = 0): Save {
  return {
    version: SAVE_VERSION,
    coins: 0,
    earned: 0,
    totalClicks: 0,
    upgrades: { click: 0, mult: 0, big: 0, offline: 0, eternal: 0 },
    michi: false,
    michiLevel: 0,
    achievements: {},
    sound: true,
    lastSeen: now,
  };
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function level(value: unknown): number {
  return Math.min(500, Math.floor(num(value)));
}

export function migrate(raw: unknown): Save {
  const blank = freshSave();
  if (!raw || typeof raw !== "object") return blank;
  const data = raw as Record<string, unknown>;
  const upgradesRaw =
    data.upgrades && typeof data.upgrades === "object"
      ? (data.upgrades as Record<string, unknown>)
      : {};
  const pets =
    data.pets && typeof data.pets === "object" ? (data.pets as Record<string, unknown>) : {};
  const achRaw =
    data.achievements && typeof data.achievements === "object"
      ? (data.achievements as Record<string, unknown>)
      : {};
  const achievements: Record<string, boolean> = {};
  for (const item of ACHIEVEMENTS) achievements[item.id] = achRaw[item.id] === true;

  let michi = data.michi === true || pets.michi === true;
  let michiLevel = level(data.michiLevel ?? pets.michiLevel);
  if (michi && michiLevel < 1) michiLevel = 1;
  if (!michi) michiLevel = 0;

  const coins = num(data.coins);
  return {
    version: SAVE_VERSION,
    coins,
    earned: num(data.earned, coins),
    totalClicks: num(data.totalClicks),
    upgrades: {
      click: level(upgradesRaw.click),
      mult: level(upgradesRaw.mult),
      big: level(upgradesRaw.big),
      offline: level(upgradesRaw.offline),
      eternal: level(upgradesRaw.eternal),
    },
    michi,
    michiLevel,
    achievements,
    sound: data.sound !== false,
    lastSeen: num(data.lastSeen, Date.now()) || Date.now(),
  };
}

export function loadSave(): Save {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return freshSave(Date.now());
    return migrate(JSON.parse(raw));
  } catch {
    try {
      const backup = localStorage.getItem(SAVE_KEY + ".bak");
      if (backup) return migrate(JSON.parse(backup));
    } catch {
      /* ignore corrupt backup */
    }
    return freshSave();
  }
}

export function writeSave(save: Save) {
  try {
    const previous = localStorage.getItem(SAVE_KEY);
    if (previous) localStorage.setItem(SAVE_KEY + ".bak", previous);
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    /* private mode or quota — keep the session in memory */
  }
}

export function fmt(value: number): string {
  const whole = Math.floor(Math.max(0, value));
  if (whole < 1000) return whole.toLocaleString("es-MX");
  const units = ["K", "M", "B", "T", "Qa", "Qi"];
  let scaled = whole;
  let index = -1;
  while (scaled >= 1000 && index < units.length - 1) {
    scaled /= 1000;
    index += 1;
  }
  const digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  return scaled.toFixed(digits) + units[index];
}

export function formatMult(value: number): string {
  const text = value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  return "×" + text;
}

export function timeFmt(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return [hours, minutes, secs].map((part) => String(part).padStart(2, "0")).join(":");
}

export function petMult(save: Save): number {
  return save.michi && save.michiLevel > 0 ? 1 + save.michiLevel * 0.1 : 1;
}

export function eternalMult(save: Save): number {
  return 5 ** save.upgrades.eternal;
}

export function clickMult(save: Save): number {
  return 1.5 ** save.upgrades.mult;
}

export function clickBase(save: Save): number {
  return 1 + save.upgrades.click + save.upgrades.big * 5;
}

export function clickGain(save: Save): number {
  return Math.max(1, Math.floor(clickBase(save) * clickMult(save) * eternalMult(save) * petMult(save)));
}

export function perSecExact(save: Save): number {
  if (!save.michi || save.michiLevel < 1) return 0;
  return save.michiLevel * MICHI_RATE * eternalMult(save) * petMult(save);
}

export function shownMult(save: Save): number {
  return clickMult(save) * eternalMult(save) * petMult(save);
}

export function loveLevel(save: Save): number {
  return 1 + Math.floor(Math.log10(Math.max(1, save.totalClicks) + 1));
}

export function upgradeCost(save: Save, id: UpgradeId): number {
  const upgrade = UPGRADES.find((item) => item.id === id);
  if (!upgrade) return Number.MAX_SAFE_INTEGER;
  const cost = Math.floor(upgrade.base * upgrade.scale ** save.upgrades[id]);
  return Number.isFinite(cost) ? cost : Number.MAX_SAFE_INTEGER;
}

export function michiCost(save: Save): number {
  if (!save.michi) return MICHI_COST;
  const cost = Math.floor(MICHI_COST * 2 ** save.michiLevel);
  return Number.isFinite(cost) ? cost : Number.MAX_SAFE_INTEGER;
}

export function offlineReward(save: Save, elapsedSec: number) {
  const elapsed = Math.max(0, elapsedSec);
  if (elapsed < OFFLINE_MIN_SEC) return { reward: 0, counted: 0, capped: false };
  const capped = elapsed > OFFLINE_CAP_SEC;
  const counted = Math.min(elapsed, OFFLINE_CAP_SEC);
  const rate = perSecExact(save);
  if (rate <= 0) return { reward: 0, counted, capped };
  const reward = Math.floor(counted * rate * 2 ** save.upgrades.offline);
  return { reward: Number.isFinite(reward) ? reward : 0, counted, capped };
}

export function gain(state: Save, amount: number, clicks = 0): Save {
  const safeAmount = Math.max(0, amount);
  if (safeAmount === 0 && clicks === 0) return state;
  const next: Save = {
    ...state,
    coins: state.coins + safeAmount,
    earned: state.earned + safeAmount,
    totalClicks: state.totalClicks + clicks,
  };
  let achievements = state.achievements;
  let copied = false;
  for (const item of ACHIEVEMENTS) {
    if (achievements[item.id]) continue;
    const value = item.kind === "clicks" ? next.totalClicks : next.earned;
    if (value >= item.goal) {
      if (!copied) {
        achievements = { ...achievements };
        copied = true;
      }
      achievements[item.id] = true;
    }
  }
  next.achievements = achievements;
  return next;
}

export function tap(state: Save, now: number): { save: Save; amount: number } {
  const amount = clickGain(state);
  return { save: { ...gain(state, amount, 1), lastSeen: now }, amount };
}

export function step(state: Save, dt: number, now: number): Save {
  const amount = perSecExact(state) * Math.max(0, dt);
  const next = amount > 0 ? gain(state, amount) : state;
  return { ...next, lastSeen: now };
}

export function buyUpgrade(state: Save, id: UpgradeId): Save | null {
  const cost = upgradeCost(state, id);
  if (state.coins < cost) return null;
  return {
    ...state,
    coins: state.coins - cost,
    upgrades: { ...state.upgrades, [id]: state.upgrades[id] + 1 },
  };
}

export function buyMichi(state: Save): Save | null {
  const cost = michiCost(state);
  if (state.coins < cost) return null;
  if (!state.michi) return { ...state, coins: state.coins - cost, michi: true, michiLevel: 1 };
  return { ...state, coins: state.coins - cost, michiLevel: state.michiLevel + 1 };
}

export function hasProgress(save: Save): boolean {
  const spentLevels =
    save.upgrades.click +
    save.upgrades.mult +
    save.upgrades.big +
    save.upgrades.offline +
    save.upgrades.eternal;
  return save.totalClicks > 0 || save.coins > 0 || save.earned > 0 || save.michi || spentLevels > 0;
}

export function achievementValue(save: Save, kind: "earned" | "clicks"): number {
  return kind === "clicks" ? save.totalClicks : save.earned;
}
