import { useEffect, useReducer, useRef, useState } from "react";
import {
  BookOpen,
  Cat,
  Heart,
  Infinity as InfinityIcon,
  MousePointerClick,
  PawPrint,
  RotateCcw,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";
import michiUrl from "@/assets/michi.jpg";
import { beep, resumeAudio, unlockAudio } from "@/lib/idle/audio";
import {
  ACHIEVEMENTS,
  UPGRADES,
  achievementValue,
  buyMichi,
  buyUpgrade,
  clickGain,
  fmt,
  formatMult,
  freshSave,
  gain,
  hasProgress,
  loadSave,
  loveLevel,
  michiCost,
  offlineReward,
  perSecExact,
  petMult,
  shownMult,
  step,
  tap,
  timeFmt,
  upgradeCost,
  writeSave,
  type Save,
  type UpgradeId,
} from "@/lib/idle/logic";

type Screen = "cover" | "play";
type Modal =
  | null
  | { type: "achievements" | "settings" | "credits" | "pets" | "diary" | "confirm-new" | "confirm-reset" }
  | { type: "offline"; reward: number; counted: number; capped: boolean };

type Action =
  | { type: "tick"; dt: number; now: number }
  | { type: "tap"; now: number }
  | { type: "buy"; id: UpgradeId }
  | { type: "michi" }
  | { type: "sound" }
  | { type: "replace"; save: Save };

type Pop = { id: number; x: number; y: number; text: string; spark: boolean; dx: string; dy: string };

const UPGRADE_ICONS = {
  click: MousePointerClick,
  mult: Heart,
  big: Heart,
  offline: Cat,
  eternal: InfinityIcon,
} as const;

const DIARY = [
  "Querida María Haide:",
  "Cada click, cada mejora y cada corazón en este juego representa todo el amor y cariño que siento por ti.",
  "Gracias por existir y por hacer mi mundo mucho más bonito.",
  "Con todo mi amor.",
];

function reducer(state: Save, action: Action): Save {
  switch (action.type) {
    case "tick":
      return step(state, action.dt, action.now);
    case "tap":
      return tap(state, action.now).save;
    case "buy":
      return buyUpgrade(state, action.id) ?? state;
    case "michi":
      return buyMichi(state) ?? state;
    case "sound":
      return { ...state, sound: !state.sound };
    case "replace":
      return action.save;
    default:
      return state;
  }
}

function HeartShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 92" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="loveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-line)" />
          <stop offset="100%" stopColor="var(--color-primary)" />
        </linearGradient>
      </defs>
      <path
        fill="url(#loveFill)"
        stroke="var(--color-bg-top)"
        strokeWidth="3"
        d="M50 86C20 66 4 50 4 32 4 16 15 6 29 6c9 0 16 5 21 13C55 11 62 6 71 6c14 0 25 10 25 26C96 50 80 66 50 86z"
      />
      <ellipse cx="34" cy="28" rx="10" ry="7" fill="var(--color-on-primary)" opacity="0.35" />
    </svg>
  );
}

function MiniHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 92" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M50 86C20 66 4 50 4 32 4 16 15 6 29 6c9 0 16 5 21 13C55 11 62 6 71 6c14 0 25 10 25 26C96 50 80 66 50 86z"
      />
    </svg>
  );
}

function DiaryBody() {
  return (
    <div className="rounded-2xl bg-cream p-4 text-base leading-relaxed">
      {DIARY.map((line) => (
        <p key={line} className="mb-3 last:mb-0">
          {line.startsWith("Con todo") || line.startsWith("Querida") ? <b>{line}</b> : line}
        </p>
      ))}
    </div>
  );
}

export function IdleLove() {
  const [save, dispatch] = useReducer(reducer, undefined, () => freshSave(0));
  const [screen, setScreen] = useState<Screen>("cover");
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pops, setPops] = useState<Pop[]>([]);
  const [down, setDown] = useState(false);
  const saveRef = useRef(save);
  const screenRef = useRef(screen);
  const zoneRef = useRef<HTMLDivElement>(null);
  const popId = useRef(0);
  const known = useRef<Set<string> | null>(null);
  const toastTimer = useRef(0);

  const modalRef = useRef(modal);
  const loveRef = useRef<(event: React.MouseEvent<HTMLButtonElement> | null) => void>(() => {});

  saveRef.current = save;
  screenRef.current = screen;
  modalRef.current = modal;

  function pushToast(text: string) {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }

  useEffect(() => {
    const loaded = loadSave();
    known.current = new Set(
      ACHIEVEMENTS.filter((item) => loaded.achievements[item.id]).map((item) => item.id),
    );
    saveRef.current = loaded;
    dispatch({ type: "replace", save: loaded });
    const id = window.setInterval(() => writeSave(saveRef.current), 2000);
    const flush = () => {
      const next = { ...saveRef.current, lastSeen: Date.now() };
      saveRef.current = next;
      writeSave(next);
    };
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        flush();
        return;
      }
      resumeAudio();
      if (screenRef.current !== "play") return;
      const current = saveRef.current;
      const elapsed = (Date.now() - current.lastSeen) / 1000;
      const offline = offlineReward(current, elapsed);
      if (offline.reward > 0) {
        const next = { ...gain(current, offline.reward), lastSeen: Date.now() };
        saveRef.current = next;
        dispatch({ type: "replace", save: next });
        writeSave(next);
        pushToast("Ganaste " + fmt(offline.reward) + " mientras estabas fuera");
      } else {
        const next = { ...current, lastSeen: Date.now() };
        saveRef.current = next;
        dispatch({ type: "replace", save: next });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", flush);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flush);
      writeSave(saveRef.current);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (screenRef.current === "play" && !document.hidden) {
        acc += dt;
        if (acc >= 0.1) {
          const stepDt = acc;
          acc = 0;
          dispatch({ type: "tick", dt: stepDt, now: Date.now() });
        }
      } else {
        acc = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (known.current === null) return;
    for (const item of ACHIEVEMENTS) {
      if (!save.achievements[item.id] || known.current.has(item.id)) continue;
      known.current.add(item.id);
      pushToast("Logro desbloqueado: " + item.name);
      if (save.sound) beep(760);
    }
  }, [save.achievements, save.sound]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      if (modalRef.current || screenRef.current !== "play") return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "BUTTON" || tag === "INPUT" || tag === "A") return;
      event.preventDefault();
      loveRef.current(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function spawn(x: number, y: number, amount: number) {
    const id = ++popId.current;
    const burst: Pop[] = [
      { id, x, y, text: "+" + fmt(amount), spark: false, dx: "0px", dy: "0px" },
    ];
    for (let i = 0; i < 5; i += 1) {
      burst.push({
        id: ++popId.current,
        x,
        y,
        text: "♥",
        spark: true,
        dx: Math.round(Math.random() * 140 - 70) + "px",
        dy: Math.round(Math.random() * -120 - 16) + "px",
      });
    }
    setPops((current) => [...current, ...burst].slice(-36));
    window.setTimeout(() => {
      setPops((current) => current.filter((pop) => !burst.some((item) => item.id === pop.id)));
    }, 920);
  }

  function loveAt(event: React.MouseEvent<HTMLButtonElement> | null) {
    unlockAudio();
    const amount = clickGain(saveRef.current);
    if (saveRef.current.sound) beep(280 + Math.random() * 150);
    const zone = zoneRef.current;
    if (zone) {
      const rect = zone.getBoundingClientRect();
      const x = event ? event.clientX - rect.left : rect.width / 2;
      const y = event ? event.clientY - rect.top : rect.height * 0.42;
      spawn(x, y, amount);
    }
    setDown(true);
    window.setTimeout(() => setDown(false), 120);
    dispatch({ type: "tap", now: Date.now() });
  }
  loveRef.current = loveAt;

  function onBuy(id: UpgradeId) {
    unlockAudio();
    const cost = upgradeCost(saveRef.current, id);
    if (saveRef.current.coins < cost) {
      pushToast("Necesitas más Lovecoins");
      return;
    }
    if (saveRef.current.sound) beep(520);
    dispatch({ type: "buy", id });
    pushToast("Mejora comprada");
  }

  function onMichi() {
    unlockAudio();
    const cost = michiCost(saveRef.current);
    if (saveRef.current.coins < cost) {
      pushToast("Necesitas " + fmt(cost) + " Lovecoins");
      return;
    }
    const adopting = !saveRef.current.michi;
    if (saveRef.current.sound) beep(640);
    dispatch({ type: "michi" });
    pushToast(adopting ? "Michi se unió a tu amor" : "Michi subió de nivel");
  }

  function startNew() {
    const next = freshSave(Date.now());
    saveRef.current = next;
    dispatch({ type: "replace", save: next });
    writeSave(next);
    setModal(null);
    setScreen("play");
  }

  function continueGame() {
    unlockAudio();
    const current = saveRef.current;
    const elapsed = (Date.now() - current.lastSeen) / 1000;
    const offline = offlineReward(current, elapsed);
    if (offline.reward > 0) {
      const next = { ...gain(current, offline.reward), lastSeen: Date.now() };
      saveRef.current = next;
      dispatch({ type: "replace", save: next });
      writeSave(next);
      setModal({ type: "offline", reward: offline.reward, counted: offline.counted, capped: offline.capped });
    } else {
      const next = { ...current, lastSeen: Date.now() };
      saveRef.current = next;
      dispatch({ type: "replace", save: next });
    }
    setScreen("play");
  }

  function resetAll() {
    const next = freshSave(Date.now());
    saveRef.current = next;
    known.current = new Set();
    dispatch({ type: "replace", save: next });
    writeSave(next);
    setScreen("cover");
    setModal(null);
    pushToast("Progreso reiniciado");
  }

  const perSecond = Math.floor(perSecExact(save));

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <MiniHeart className="float-deco lag-1 deco-a" />
        <MiniHeart className="float-deco lag-2 deco-b" />
        <MiniHeart className="float-deco lag-3 deco-c" />
        <MiniHeart className="float-deco deco-d" />
      </div>

      {screen === "cover" ? (
        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-5 px-4 py-8 text-center">
          <div className="relative grid place-items-center">
            <HeartShape className="cover-heart" />
            <div className="absolute inset-0 grid place-items-center px-8 pb-6">
              <h1 className="cover-title font-display text-4xl leading-none font-extrabold sm:text-6xl">
                Maria Haide
                <small className="mt-2 block font-sans text-lg font-black tracking-wide text-on-primary sm:text-2xl">
                  Idle love
                </small>
              </h1>
            </div>
          </div>
          <div className="flex items-end justify-center gap-6">
            <img src={michiUrl} alt="" className="bob h-28 w-28 rounded-3xl object-contain sm:h-36 sm:w-36" />
            <img src={michiUrl} alt="" className="bob-flip lag-4 h-28 w-28 rounded-3xl object-contain sm:h-36 sm:w-36" />
          </div>
          <p className="rounded-full border-2 border-line bg-surface px-5 py-3 text-base font-extrabold shadow-card">
            Un juego dedicado a María Haide
          </p>
          <button className="press" onClick={() => (hasProgress(save) ? setModal({ type: "confirm-new" }) : startNew())}>
            <Heart className="size-6" aria-hidden="true" /> Jugar
          </button>
          <button className="press secondary" onClick={continueGame}>
            <Heart className="size-5" aria-hidden="true" /> Continuar
            {hasProgress(save) ? <span className="text-sm font-extrabold text-muted">· {fmt(save.coins)}</span> : null}
          </button>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="menu-btn" onClick={() => setModal({ type: "achievements" })}>
              <Trophy className="size-4" aria-hidden="true" /> Logros
            </button>
            <button className="menu-btn" onClick={() => setModal({ type: "settings" })}>
              <Settings className="size-4" aria-hidden="true" /> Ajustes
            </button>
            <button className="menu-btn" onClick={() => setModal({ type: "credits" })}>
              <BookOpen className="size-4" aria-hidden="true" /> Créditos
            </button>
          </div>
          <p className="mt-2 flex items-center gap-2 text-lg font-black">
            <Cat className="size-6" aria-hidden="true" /> Hecho con amor para María Haide
          </p>
        </main>
      ) : (
        <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-3 p-3 sm:p-4">
          <header className="topbar">
            <div className="panel px-4 py-3 text-center sm:text-left">
              <span className="block text-sm font-extrabold text-muted">Lovecoins</span>
              <b className="font-display text-3xl leading-none">{fmt(save.coins)}</b>
              <span className="mt-1 block text-sm font-extrabold text-muted">Clicks: {fmt(save.totalClicks)}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button className="icon-btn" onClick={() => setModal({ type: "pets" })}>
                <Cat className="size-5" aria-hidden="true" /> Mascotas
              </button>
              <button className="icon-btn" onClick={() => setModal({ type: "diary" })}>
                <BookOpen className="size-5" aria-hidden="true" /> Diario
              </button>
              <button className="icon-btn" onClick={() => setModal({ type: "achievements" })}>
                <Trophy className="size-5" aria-hidden="true" /> Logros
              </button>
              <button className="icon-btn" onClick={() => setModal({ type: "settings" })}>
                <Settings className="size-5" aria-hidden="true" /> Ajustes
              </button>
            </div>
          </header>

          <div className="play-grid">
            <section ref={zoneRef} className="panel relative flex min-h-96 flex-col items-center justify-center overflow-hidden px-4 py-8">
              <button
                type="button"
                className={down ? "heart-btn is-down" : "heart-btn"}
                onClick={(event) => loveAt(event)}
                aria-label="Dar un clic de amor"
              >
                <HeartShape />
                <span className="heart-label">
                  ¡Amor!
                  <Heart className="mx-auto size-7" aria-hidden="true" />
                </span>
              </button>
              <dl className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 text-center">
                <div>
                  <dt className="text-sm font-extrabold text-muted">Ganancia por clic</dt>
                  <dd className="text-2xl font-black">{fmt(clickGain(save))}</dd>
                </div>
                <div>
                  <dt className="text-sm font-extrabold text-muted">Multiplicador</dt>
                  <dd className="text-2xl font-black">{formatMult(shownMult(save))}</dd>
                </div>
                <div>
                  <dt className="text-sm font-extrabold text-muted">Ganancia por segundo</dt>
                  <dd className="text-2xl font-black">{fmt(perSecond)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-lg font-black">Nivel de amor: {loveLevel(save)}</p>
              {!save.michi ? (
                <p className="mt-2 max-w-sm text-center text-sm leading-snug font-extrabold text-muted">
                  Michi genera amor por segundo. Adóptalo y la partida sigue aunque cierres la página.
                </p>
              ) : null}
              {pops.map((pop) => (
                <span
                  key={pop.id}
                  className={pop.spark ? "spark" : "pop-float"}
                  style={{ left: pop.x, top: pop.y, ["--dx" as string]: pop.dx, ["--dy" as string]: pop.dy }}
                >
                  {pop.text}
                </span>
              ))}
            </section>

            <section className="panel">
              <h2 className="py-4 text-center font-display text-2xl font-extrabold">Mejoras</h2>
              <ul className="shop-list grid gap-2 overflow-auto px-3 pb-3">
                {UPGRADES.map((upgrade) => {
                  const Icon = UPGRADE_ICONS[upgrade.id];
                  const cost = upgradeCost(save, upgrade.id);
                  const owned = save.upgrades[upgrade.id];
                  return (
                    <li
                      key={upgrade.id}
                      className="upgrade-row rounded-2xl border-2 border-line bg-cream p-2"
                    >
                      <Icon className="mx-auto size-7 text-primary" aria-hidden="true" />
                      <div className="min-w-0">
                        <h3 className="text-base leading-tight font-black">
                          {upgrade.name} <span className="text-sm font-extrabold text-muted">Nv.{owned}</span>
                        </h3>
                        <p className="text-sm leading-snug text-muted">{upgrade.desc}</p>
                      </div>
                      <button type="button" className="buy" disabled={save.coins < cost} onClick={() => onBuy(upgrade.id)}>
                        {fmt(cost)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <section className="panel p-4">
              <h2 className="mb-3 text-center font-display text-xl font-extrabold">Mascotas</h2>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-line bg-cream p-3">
                <img src={michiUrl} alt="Michi" className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <b className="block text-lg">Michi</b>
                  <span className="text-sm font-extrabold text-muted">Nivel {save.michi ? save.michiLevel : 0}</span>
                  <b className="mt-1 block">{save.michi ? formatMult(petMult(save)) + " ganancias" : "Aún no está contigo"}</b>
                </div>
              </div>
              <button type="button" className="claim" onClick={onMichi}>
                <PawPrint className="mr-1 inline size-4" aria-hidden="true" />
                {save.michi ? "Subir nivel · " + fmt(michiCost(save)) : "Adoptar · " + fmt(michiCost(save))}
              </button>
            </section>
            <section className="panel p-4">
              <h2 className="mb-3 text-center font-display text-xl font-extrabold">Logros</h2>
              <ul className="grid gap-2">
                {ACHIEVEMENTS.slice(0, 3).map((item) => {
                  const value = achievementValue(save, item.kind);
                  const pct = Math.max(0, Math.min(100, (value / item.goal) * 100));
                  const done = save.achievements[item.id] === true;
                  return (
                    <li key={item.id} className="border-b border-line pb-2 text-sm last:border-0">
                      <b className="block">
                        {done ? "Listo · " : ""}
                        {item.name}
                      </b>
                      <span className="text-muted">{item.detail}</span>
                      <span className="mt-1 block h-2 overflow-hidden rounded-full bg-line">
                        <i className="block h-full rounded-full bg-primary" style={{ width: pct + "%" }} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
            <section className="panel p-4">
              <h2 className="mb-3 text-center font-display text-xl font-extrabold">Diario</h2>
              <DiaryBody />
            </section>
          </div>
        </main>
      )}

      <div className={toast ? "toast show" : "toast"} role="status">
        {toast}
      </div>
      {modal ? (
        <div className="scrim fixed inset-0 z-30 grid place-items-center p-4" onClick={() => setModal(null)}>
          <div
            role="dialog"
            aria-modal="true"
            className="panel modal-card w-full max-w-md overflow-auto p-6 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalBody
              modal={modal}
              save={save}
              onClose={() => setModal(null)}
              onNew={startNew}
              onReset={resetAll}
              onSound={() => {
                unlockAudio();
                dispatch({ type: "sound" });
              }}
              onAskReset={() => setModal({ type: "confirm-reset" })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ModalBody({
  modal,
  save,
  onClose,
  onNew,
  onReset,
  onSound,
  onAskReset,
}: {
  modal: Exclude<Modal, null>;
  save: Save;
  onClose: () => void;
  onNew: () => void;
  onReset: () => void;
  onSound: () => void;
  onAskReset: () => void;
}) {
  if (modal.type === "offline") {
    return (
      <>
        <h2 className="font-display text-2xl font-extrabold">Bienvenido de nuevo</h2>
        <p className="mt-2">Tu amor siguió creciendo mientras estabas fuera.</p>
        <p className="mt-3 font-black">Tiempo offline: {timeFmt(modal.counted)}</p>
        <p className="text-xl font-black">Ganaste {fmt(modal.reward)}</p>
        {modal.capped ? <p className="text-sm text-muted">Se cuentan como máximo 8 horas.</p> : null}
        <button type="button" className="claim" onClick={onClose}>
          Reclamar
        </button>
      </>
    );
  }
  if (modal.type === "achievements") {
    return (
      <>
        <h2 className="font-display text-2xl font-extrabold">Logros</h2>
        <ul className="mt-3 grid gap-3 text-left">
          {ACHIEVEMENTS.map((item) => (
            <li key={item.id}>
              <b>{save.achievements[item.id] ? "Listo · " : ""}{item.name}</b>
              <span className="block text-sm text-muted">{item.detail}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="claim" onClick={onClose}>
          Cerrar
        </button>
      </>
    );
  }
  if (modal.type === "pets") {
    return (
      <>
        <img src={michiUrl} alt="" className="mx-auto h-28 w-28 rounded-full object-cover" />
        <h2 className="mt-2 font-display text-2xl font-extrabold">Michi</h2>
        <p>Nivel {save.michi ? save.michiLevel : 0}</p>
        <p className="mt-2 text-sm">Las mascotas generan Lovecoins cada segundo y también mejoran tus clics.</p>
        <button type="button" className="claim" onClick={onClose}>
          Cerrar
        </button>
      </>
    );
  }
  if (modal.type === "diary") {
    return (
      <>
        <h2 className="font-display text-2xl font-extrabold">Diario</h2>
        <div className="mt-3 text-left">
          <DiaryBody />
        </div>
        <button type="button" className="claim" onClick={onClose}>
          Cerrar
        </button>
      </>
    );
  }
  if (modal.type === "credits") {
    return (
      <>
        <h2 className="font-display text-2xl font-extrabold">Créditos</h2>
        <p className="mt-3 font-black">Maria Haide Idle Love</p>
        <p className="mt-2">Un pequeño juego hecho con amor para María Haide.</p>
        <button type="button" className="claim" onClick={onClose}>
          Cerrar
        </button>
      </>
    );
  }
  if (modal.type === "settings") {
    return (
      <>
        <h2 className="font-display text-2xl font-extrabold">Ajustes</h2>
        <p className="mt-3">
          Sonido: <b>{save.sound ? "Activado" : "Desactivado"}</b>
        </p>
        <button type="button" className="claim" onClick={onSound}>
          {save.sound ? "Silenciar" : "Activar sonido"}
        </button>
        <button type="button" className="claim" onClick={onClose}>
          Cerrar
        </button>
        <button type="button" className="menu-btn mx-auto mt-3" onClick={onAskReset}>
          <RotateCcw className="size-4" aria-hidden="true" /> Reiniciar progreso
        </button>
      </>
    );
  }
  if (modal.type === "confirm-new") {
    return (
      <>
        <h2 className="font-display text-2xl font-extrabold">¿Nueva partida?</h2>
        <p className="mt-2">Esto borra el progreso guardado en este navegador.</p>
        <button type="button" className="claim" onClick={onNew}>
          Empezar de cero
        </button>
        <button type="button" className="claim" onClick={onClose}>
          Cancelar
        </button>
      </>
    );
  }
  return (
    <>
      <h2 className="font-display text-2xl font-extrabold">¿Borrar todo?</h2>
      <p className="mt-2">Se pierde el amor, Michi y los logros de esta partida.</p>
      <button type="button" className="claim" onClick={onReset}>
        <Sparkles className="mr-1 inline size-4" aria-hidden="true" /> Sí, reiniciar
      </button>
      <button type="button" className="claim" onClick={onClose}>
        Cancelar
      </button>
    </>
  );
}
