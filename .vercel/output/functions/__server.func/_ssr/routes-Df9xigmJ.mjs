import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RotateCcw, c as Infinity$1, d as BookOpen, i as Settings, l as Heart, o as PawPrint, r as Sparkles, s as MousePointerClick, t as Trophy, u as Cat } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Df9xigmJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var michi_default = "/assets/michi-DeJZNUhs.jpg";
var ctx = null;
var sfx = null;
function ensure() {
	if (ctx) return ctx;
	const AudioCtx = window.AudioContext || window.webkitAudioContext;
	if (!AudioCtx) return null;
	ctx = new AudioCtx({ latencyHint: "interactive" });
	const master = ctx.createGain();
	sfx = ctx.createGain();
	sfx.gain.value = 1;
	master.gain.value = .9;
	sfx.connect(master);
	master.connect(ctx.destination);
	return ctx;
}
/** Call synchronously inside a tap or key press. iOS stays silent otherwise. */
function unlockAudio() {
	const audio = ensure();
	if (audio && audio.state === "suspended") audio.resume();
}
function resumeAudio() {
	if (ctx && ctx.state === "suspended") ctx.resume();
}
function beep(freq) {
	if (!ctx || ctx.state !== "running" || !sfx) return;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	osc.frequency.value = freq;
	osc.connect(gain);
	gain.connect(sfx);
	const start = ctx.currentTime;
	gain.gain.setValueAtTime(1e-4, start);
	gain.gain.exponentialRampToValueAtTime(.045, start + .012);
	gain.gain.exponentialRampToValueAtTime(1e-4, start + .12);
	osc.start(start);
	osc.stop(start + .13);
	osc.onended = () => {
		osc.disconnect();
		gain.disconnect();
	};
}
var SAVE_KEY = "mariaHaideIdleLove";
var OFFLINE_CAP_SEC = 28800;
var UPGRADES = [
	{
		id: "click",
		name: "Clicks",
		desc: "+1 por clic",
		base: 200,
		scale: 1.65
	},
	{
		id: "mult",
		name: "Lovecoins",
		desc: "×1.5 ganancias por clic",
		base: 1e3,
		scale: 2.3
	},
	{
		id: "big",
		name: "Corazón Grande",
		desc: "+5 por clic",
		base: 2500,
		scale: 2
	},
	{
		id: "offline",
		name: "Gatito Feliz",
		desc: "×2 ganancias offline",
		base: 5e3,
		scale: 2.5
	},
	{
		id: "eternal",
		name: "Amor Eterno",
		desc: "×5 todas las ganancias",
		base: 1e4,
		scale: 3.2
	}
];
var ACHIEVEMENTS = [
	{
		id: "first",
		name: "Primer amor",
		goal: 100,
		kind: "earned",
		detail: "Obtén 100 Lovecoins"
	},
	{
		id: "dedicated",
		name: "Amante dedicado",
		goal: 1e3,
		kind: "earned",
		detail: "Obtén 1,000 Lovecoins"
	},
	{
		id: "infinite",
		name: "Amor infinito",
		goal: 1e4,
		kind: "earned",
		detail: "Obtén 10,000 Lovecoins"
	},
	{
		id: "million",
		name: "Corazón millonario",
		goal: 1e6,
		kind: "earned",
		detail: "Obtén 1,000,000 Lovecoins"
	},
	{
		id: "clicker",
		name: "Amor incansable",
		goal: 1e4,
		kind: "clicks",
		detail: "Realiza 10,000 clicks"
	}
];
function freshSave(now = 0) {
	return {
		version: 2,
		coins: 0,
		earned: 0,
		totalClicks: 0,
		upgrades: {
			click: 0,
			mult: 0,
			big: 0,
			offline: 0,
			eternal: 0
		},
		michi: false,
		michiLevel: 0,
		achievements: {},
		sound: true,
		lastSeen: now
	};
}
function num(value, fallback = 0) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;
}
function level(value) {
	return Math.min(500, Math.floor(num(value)));
}
function migrate(raw) {
	const blank = freshSave();
	if (!raw || typeof raw !== "object") return blank;
	const data = raw;
	const upgradesRaw = data.upgrades && typeof data.upgrades === "object" ? data.upgrades : {};
	const pets = data.pets && typeof data.pets === "object" ? data.pets : {};
	const achRaw = data.achievements && typeof data.achievements === "object" ? data.achievements : {};
	const achievements = {};
	for (const item of ACHIEVEMENTS) achievements[item.id] = achRaw[item.id] === true;
	let michi = data.michi === true || pets.michi === true;
	let michiLevel = level(data.michiLevel ?? pets.michiLevel);
	if (michi && michiLevel < 1) michiLevel = 1;
	if (!michi) michiLevel = 0;
	const coins = num(data.coins);
	return {
		version: 2,
		coins,
		earned: num(data.earned, coins),
		totalClicks: num(data.totalClicks),
		upgrades: {
			click: level(upgradesRaw.click),
			mult: level(upgradesRaw.mult),
			big: level(upgradesRaw.big),
			offline: level(upgradesRaw.offline),
			eternal: level(upgradesRaw.eternal)
		},
		michi,
		michiLevel,
		achievements,
		sound: data.sound !== false,
		lastSeen: num(data.lastSeen, Date.now()) || Date.now()
	};
}
function loadSave() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return freshSave(Date.now());
		return migrate(JSON.parse(raw));
	} catch {
		try {
			const backup = localStorage.getItem(SAVE_KEY + ".bak");
			if (backup) return migrate(JSON.parse(backup));
		} catch {}
		return freshSave();
	}
}
function writeSave(save) {
	try {
		const previous = localStorage.getItem(SAVE_KEY);
		if (previous) localStorage.setItem(SAVE_KEY + ".bak", previous);
		localStorage.setItem(SAVE_KEY, JSON.stringify(save));
	} catch {}
}
function fmt(value) {
	const whole = Math.floor(Math.max(0, value));
	if (whole < 1e3) return whole.toLocaleString("es-MX");
	const units = [
		"K",
		"M",
		"B",
		"T",
		"Qa",
		"Qi"
	];
	let scaled = whole;
	let index = -1;
	while (scaled >= 1e3 && index < units.length - 1) {
		scaled /= 1e3;
		index += 1;
	}
	const digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
	return scaled.toFixed(digits) + units[index];
}
function formatMult(value) {
	return "×" + value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
function timeFmt(seconds) {
	const total = Math.max(0, Math.floor(seconds));
	return [
		Math.floor(total / 3600),
		Math.floor(total % 3600 / 60),
		total % 60
	].map((part) => String(part).padStart(2, "0")).join(":");
}
function petMult(save) {
	return save.michi && save.michiLevel > 0 ? 1 + save.michiLevel * .1 : 1;
}
function eternalMult(save) {
	return 5 ** save.upgrades.eternal;
}
function clickMult(save) {
	return 1.5 ** save.upgrades.mult;
}
function clickBase(save) {
	return 1 + save.upgrades.click + save.upgrades.big * 5;
}
function clickGain(save) {
	return Math.max(1, Math.floor(clickBase(save) * clickMult(save) * eternalMult(save) * petMult(save)));
}
function perSecExact(save) {
	if (!save.michi || save.michiLevel < 1) return 0;
	return save.michiLevel * 5 * eternalMult(save) * petMult(save);
}
function shownMult(save) {
	return clickMult(save) * eternalMult(save) * petMult(save);
}
function loveLevel(save) {
	return 1 + Math.floor(Math.log10(Math.max(1, save.totalClicks) + 1));
}
function upgradeCost(save, id) {
	const upgrade = UPGRADES.find((item) => item.id === id);
	if (!upgrade) return Number.MAX_SAFE_INTEGER;
	const cost = Math.floor(upgrade.base * upgrade.scale ** save.upgrades[id]);
	return Number.isFinite(cost) ? cost : Number.MAX_SAFE_INTEGER;
}
function michiCost(save) {
	if (!save.michi) return 800;
	const cost = Math.floor(800 * 2 ** save.michiLevel);
	return Number.isFinite(cost) ? cost : Number.MAX_SAFE_INTEGER;
}
function offlineReward(save, elapsedSec) {
	const elapsed = Math.max(0, elapsedSec);
	if (elapsed < 30) return {
		reward: 0,
		counted: 0,
		capped: false
	};
	const capped = elapsed > OFFLINE_CAP_SEC;
	const counted = Math.min(elapsed, OFFLINE_CAP_SEC);
	const rate = perSecExact(save);
	if (rate <= 0) return {
		reward: 0,
		counted,
		capped
	};
	const reward = Math.floor(counted * rate * 2 ** save.upgrades.offline);
	return {
		reward: Number.isFinite(reward) ? reward : 0,
		counted,
		capped
	};
}
function gain(state, amount, clicks = 0) {
	const safeAmount = Math.max(0, amount);
	if (safeAmount === 0 && clicks === 0) return state;
	const next = {
		...state,
		coins: state.coins + safeAmount,
		earned: state.earned + safeAmount,
		totalClicks: state.totalClicks + clicks
	};
	let achievements = state.achievements;
	let copied = false;
	for (const item of ACHIEVEMENTS) {
		if (achievements[item.id]) continue;
		if ((item.kind === "clicks" ? next.totalClicks : next.earned) >= item.goal) {
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
function tap(state, now) {
	const amount = clickGain(state);
	return {
		save: {
			...gain(state, amount, 1),
			lastSeen: now
		},
		amount
	};
}
function step(state, dt, now) {
	const amount = perSecExact(state) * Math.max(0, dt);
	return {
		...amount > 0 ? gain(state, amount) : state,
		lastSeen: now
	};
}
function buyUpgrade(state, id) {
	const cost = upgradeCost(state, id);
	if (state.coins < cost) return null;
	return {
		...state,
		coins: state.coins - cost,
		upgrades: {
			...state.upgrades,
			[id]: state.upgrades[id] + 1
		}
	};
}
function buyMichi(state) {
	const cost = michiCost(state);
	if (state.coins < cost) return null;
	if (!state.michi) return {
		...state,
		coins: state.coins - cost,
		michi: true,
		michiLevel: 1
	};
	return {
		...state,
		coins: state.coins - cost,
		michiLevel: state.michiLevel + 1
	};
}
function hasProgress(save) {
	const spentLevels = save.upgrades.click + save.upgrades.mult + save.upgrades.big + save.upgrades.offline + save.upgrades.eternal;
	return save.totalClicks > 0 || save.coins > 0 || save.earned > 0 || save.michi || spentLevels > 0;
}
function achievementValue(save, kind) {
	return kind === "clicks" ? save.totalClicks : save.earned;
}
var UPGRADE_ICONS = {
	click: MousePointerClick,
	mult: Heart,
	big: Heart,
	offline: Cat,
	eternal: Infinity$1
};
var DIARY = [
	"Querida María Haide:",
	"Cada click, cada mejora y cada corazón en este juego representa todo el amor y cariño que siento por ti.",
	"Gracias por existir y por hacer mi mundo mucho más bonito.",
	"Con todo mi amor."
];
function reducer(state, action) {
	switch (action.type) {
		case "tick": return step(state, action.dt, action.now);
		case "tap": return tap(state, action.now).save;
		case "buy": return buyUpgrade(state, action.id) ?? state;
		case "michi": return buyMichi(state) ?? state;
		case "sound": return {
			...state,
			sound: !state.sound
		};
		case "replace": return action.save;
		default: return state;
	}
}
function HeartShape({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 100 92",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "loveFill",
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "var(--color-line)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "var(--color-primary)"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "url(#loveFill)",
				stroke: "var(--color-bg-top)",
				strokeWidth: "3",
				d: "M50 86C20 66 4 50 4 32 4 16 15 6 29 6c9 0 16 5 21 13C55 11 62 6 71 6c14 0 25 10 25 26C96 50 80 66 50 86z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "34",
				cy: "28",
				rx: "10",
				ry: "7",
				fill: "var(--color-on-primary)",
				opacity: "0.35"
			})
		]
	});
}
function MiniHeart({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 100 92",
		className,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M50 86C20 66 4 50 4 32 4 16 15 6 29 6c9 0 16 5 21 13C55 11 62 6 71 6c14 0 25 10 25 26C96 50 80 66 50 86z"
		})
	});
}
function DiaryBody() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl bg-cream p-4 text-base leading-relaxed",
		children: DIARY.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 last:mb-0",
			children: line.startsWith("Con todo") || line.startsWith("Querida") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: line }) : line
		}, line))
	});
}
function IdleLove() {
	const [save, dispatch] = (0, import_react.useReducer)(reducer, void 0, () => freshSave(0));
	const [screen, setScreen] = (0, import_react.useState)("cover");
	const [modal, setModal] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)(null);
	const [pops, setPops] = (0, import_react.useState)([]);
	const [down, setDown] = (0, import_react.useState)(false);
	const saveRef = (0, import_react.useRef)(save);
	const screenRef = (0, import_react.useRef)(screen);
	const zoneRef = (0, import_react.useRef)(null);
	const popId = (0, import_react.useRef)(0);
	const known = (0, import_react.useRef)(null);
	const toastTimer = (0, import_react.useRef)(0);
	const modalRef = (0, import_react.useRef)(modal);
	const loveRef = (0, import_react.useRef)(() => {});
	saveRef.current = save;
	screenRef.current = screen;
	modalRef.current = modal;
	function pushToast(text) {
		setToast(text);
		window.clearTimeout(toastTimer.current);
		toastTimer.current = window.setTimeout(() => setToast(null), 1800);
	}
	(0, import_react.useEffect)(() => {
		const loaded = loadSave();
		known.current = new Set(ACHIEVEMENTS.filter((item) => loaded.achievements[item.id]).map((item) => item.id));
		saveRef.current = loaded;
		dispatch({
			type: "replace",
			save: loaded
		});
		const id = window.setInterval(() => writeSave(saveRef.current), 2e3);
		const flush = () => {
			const next = {
				...saveRef.current,
				lastSeen: Date.now()
			};
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
			const offline = offlineReward(current, (Date.now() - current.lastSeen) / 1e3);
			if (offline.reward > 0) {
				const next = {
					...gain(current, offline.reward),
					lastSeen: Date.now()
				};
				saveRef.current = next;
				dispatch({
					type: "replace",
					save: next
				});
				writeSave(next);
				pushToast("Ganaste " + fmt(offline.reward) + " mientras estabas fuera");
			} else {
				const next = {
					...current,
					lastSeen: Date.now()
				};
				saveRef.current = next;
				dispatch({
					type: "replace",
					save: next
				});
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
	(0, import_react.useEffect)(() => {
		let raf = 0;
		let last = performance.now();
		let acc = 0;
		const loop = (now) => {
			const dt = Math.min(.1, (now - last) / 1e3);
			last = now;
			if (screenRef.current === "play" && !document.hidden) {
				acc += dt;
				if (acc >= .1) {
					const stepDt = acc;
					acc = 0;
					dispatch({
						type: "tick",
						dt: stepDt,
						now: Date.now()
					});
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
	(0, import_react.useEffect)(() => {
		if (known.current === null) return;
		for (const item of ACHIEVEMENTS) {
			if (!save.achievements[item.id] || known.current.has(item.id)) continue;
			known.current.add(item.id);
			pushToast("Logro desbloqueado: " + item.name);
			if (save.sound) beep(760);
		}
	}, [save.achievements, save.sound]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.code !== "Space") return;
			if (modalRef.current || screenRef.current !== "play") return;
			const tag = event.target?.tagName;
			if (tag === "BUTTON" || tag === "INPUT" || tag === "A") return;
			event.preventDefault();
			loveRef.current(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	function spawn(x, y, amount) {
		const burst = [{
			id: ++popId.current,
			x,
			y,
			text: "+" + fmt(amount),
			spark: false,
			dx: "0px",
			dy: "0px"
		}];
		for (let i = 0; i < 5; i += 1) burst.push({
			id: ++popId.current,
			x,
			y,
			text: "♥",
			spark: true,
			dx: Math.round(Math.random() * 140 - 70) + "px",
			dy: Math.round(Math.random() * -120 - 16) + "px"
		});
		setPops((current) => [...current, ...burst].slice(-36));
		window.setTimeout(() => {
			setPops((current) => current.filter((pop) => !burst.some((item) => item.id === pop.id)));
		}, 920);
	}
	function loveAt(event) {
		unlockAudio();
		const amount = clickGain(saveRef.current);
		if (saveRef.current.sound) beep(280 + Math.random() * 150);
		const zone = zoneRef.current;
		if (zone) {
			const rect = zone.getBoundingClientRect();
			spawn(event ? event.clientX - rect.left : rect.width / 2, event ? event.clientY - rect.top : rect.height * .42, amount);
		}
		setDown(true);
		window.setTimeout(() => setDown(false), 120);
		dispatch({
			type: "tap",
			now: Date.now()
		});
	}
	loveRef.current = loveAt;
	function onBuy(id) {
		unlockAudio();
		const cost = upgradeCost(saveRef.current, id);
		if (saveRef.current.coins < cost) {
			pushToast("Necesitas más Lovecoins");
			return;
		}
		if (saveRef.current.sound) beep(520);
		dispatch({
			type: "buy",
			id
		});
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
		dispatch({
			type: "replace",
			save: next
		});
		writeSave(next);
		setModal(null);
		setScreen("play");
	}
	function continueGame() {
		unlockAudio();
		const current = saveRef.current;
		const offline = offlineReward(current, (Date.now() - current.lastSeen) / 1e3);
		if (offline.reward > 0) {
			const next = {
				...gain(current, offline.reward),
				lastSeen: Date.now()
			};
			saveRef.current = next;
			dispatch({
				type: "replace",
				save: next
			});
			writeSave(next);
			setModal({
				type: "offline",
				reward: offline.reward,
				counted: offline.counted,
				capped: offline.capped
			});
		} else {
			const next = {
				...current,
				lastSeen: Date.now()
			};
			saveRef.current = next;
			dispatch({
				type: "replace",
				save: next
			});
		}
		setScreen("play");
	}
	function resetAll() {
		const next = freshSave(Date.now());
		saveRef.current = next;
		known.current = /* @__PURE__ */ new Set();
		dispatch({
			type: "replace",
			save: next
		});
		writeSave(next);
		setScreen("cover");
		setModal(null);
		pushToast("Progreso reiniciado");
	}
	const perSecond = Math.floor(perSecExact(save));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 overflow-hidden",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniHeart, { className: "float-deco lag-1 deco-a" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniHeart, { className: "float-deco lag-2 deco-b" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniHeart, { className: "float-deco lag-3 deco-c" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniHeart, { className: "float-deco deco-d" })
				]
			}),
			screen === "cover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-5 px-4 py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid place-items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartShape, { className: "cover-heart" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 grid place-items-center px-8 pb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "cover-title font-display text-4xl leading-none font-extrabold sm:text-6xl",
								children: ["Maria Haide", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									className: "mt-2 block font-sans text-lg font-black tracking-wide text-on-primary sm:text-2xl",
									children: "Idle love"
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-center gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: michi_default,
							alt: "",
							className: "bob h-28 w-28 rounded-3xl object-contain sm:h-36 sm:w-36"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: michi_default,
							alt: "",
							className: "bob-flip lag-4 h-28 w-28 rounded-3xl object-contain sm:h-36 sm:w-36"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-full border-2 border-line bg-surface px-5 py-3 text-base font-extrabold shadow-card",
						children: "Un juego dedicado a María Haide"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "press",
						onClick: () => hasProgress(save) ? setModal({ type: "confirm-new" }) : startNew(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
							className: "size-6",
							"aria-hidden": "true"
						}), " Jugar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "press secondary",
						onClick: continueGame,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								className: "size-5",
								"aria-hidden": "true"
							}),
							" Continuar",
							hasProgress(save) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-extrabold text-muted",
								children: ["· ", fmt(save.coins)]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "menu-btn",
								onClick: () => setModal({ type: "achievements" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
									className: "size-4",
									"aria-hidden": "true"
								}), " Logros"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "menu-btn",
								onClick: () => setModal({ type: "settings" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
									className: "size-4",
									"aria-hidden": "true"
								}), " Ajustes"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "menu-btn",
								onClick: () => setModal({ type: "credits" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
									className: "size-4",
									"aria-hidden": "true"
								}), " Créditos"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex items-center gap-2 text-lg font-black",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cat, {
							className: "size-6",
							"aria-hidden": "true"
						}), " Hecho con amor para María Haide"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-3 p-3 sm:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "topbar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel px-4 py-3 text-center sm:text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-extrabold text-muted",
									children: "Lovecoins"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "font-display text-3xl leading-none",
									children: fmt(save.coins)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 block text-sm font-extrabold text-muted",
									children: ["Clicks: ", fmt(save.totalClicks)]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-4 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "icon-btn",
									onClick: () => setModal({ type: "pets" }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cat, {
										className: "size-5",
										"aria-hidden": "true"
									}), " Mascotas"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "icon-btn",
									onClick: () => setModal({ type: "diary" }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
										className: "size-5",
										"aria-hidden": "true"
									}), " Diario"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "icon-btn",
									onClick: () => setModal({ type: "achievements" }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
										className: "size-5",
										"aria-hidden": "true"
									}), " Logros"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "icon-btn",
									onClick: () => setModal({ type: "settings" }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
										className: "size-5",
										"aria-hidden": "true"
									}), " Ajustes"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "play-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							ref: zoneRef,
							className: "panel relative flex min-h-96 flex-col items-center justify-center overflow-hidden px-4 py-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: down ? "heart-btn is-down" : "heart-btn",
									onClick: (event) => loveAt(event),
									"aria-label": "Dar un clic de amor",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartShape, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "heart-label",
										children: ["¡Amor!", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
											className: "mx-auto size-7",
											"aria-hidden": "true"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-sm font-extrabold text-muted",
											children: "Ganancia por clic"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-2xl font-black",
											children: fmt(clickGain(save))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-sm font-extrabold text-muted",
											children: "Multiplicador"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-2xl font-black",
											children: formatMult(shownMult(save))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-sm font-extrabold text-muted",
											children: "Ganancia por segundo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-2xl font-black",
											children: fmt(perSecond)
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-lg font-black",
									children: ["Nivel de amor: ", loveLevel(save)]
								}),
								!save.michi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-sm text-center text-sm leading-snug font-extrabold text-muted",
									children: "Michi genera amor por segundo. Adóptalo y la partida sigue aunque cierres la página."
								}) : null,
								pops.map((pop) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: pop.spark ? "spark" : "pop-float",
									style: {
										left: pop.x,
										top: pop.y,
										["--dx"]: pop.dx,
										["--dy"]: pop.dy
									},
									children: pop.text
								}, pop.id))
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "panel",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "py-4 text-center font-display text-2xl font-extrabold",
								children: "Mejoras"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "shop-list grid gap-2 overflow-auto px-3 pb-3",
								children: UPGRADES.map((upgrade) => {
									const Icon = UPGRADE_ICONS[upgrade.id];
									const cost = upgradeCost(save, upgrade.id);
									const owned = save.upgrades[upgrade.id];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "upgrade-row rounded-2xl border-2 border-line bg-cream p-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												className: "mx-auto size-7 text-primary",
												"aria-hidden": "true"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
													className: "text-base leading-tight font-black",
													children: [
														upgrade.name,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-sm font-extrabold text-muted",
															children: ["Nv.", owned]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm leading-snug text-muted",
													children: upgrade.desc
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "buy",
												disabled: save.coins < cost,
												onClick: () => onBuy(upgrade.id),
												children: fmt(cost)
											})
										]
									}, upgrade.id);
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "panel p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mb-3 text-center font-display text-xl font-extrabold",
										children: "Mascotas"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 rounded-2xl border-2 border-line bg-cream p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: michi_default,
											alt: "Michi",
											className: "h-16 w-16 rounded-full object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
												className: "block text-lg",
												children: "Michi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-extrabold text-muted",
												children: ["Nivel ", save.michi ? save.michiLevel : 0]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
												className: "mt-1 block",
												children: save.michi ? formatMult(petMult(save)) + " ganancias" : "Aún no está contigo"
											})
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "claim",
										onClick: onMichi,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PawPrint, {
											className: "mr-1 inline size-4",
											"aria-hidden": "true"
										}), save.michi ? "Subir nivel · " + fmt(michiCost(save)) : "Adoptar · " + fmt(michiCost(save))]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "panel p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-3 text-center font-display text-xl font-extrabold",
									children: "Logros"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "grid gap-2",
									children: ACHIEVEMENTS.slice(0, 3).map((item) => {
										const value = achievementValue(save, item.kind);
										const pct = Math.max(0, Math.min(100, value / item.goal * 100));
										const done = save.achievements[item.id] === true;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "border-b border-line pb-2 text-sm last:border-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
													className: "block",
													children: [done ? "Listo · " : "", item.name]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted",
													children: item.detail
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-1 block h-2 overflow-hidden rounded-full bg-line",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
														className: "block h-full rounded-full bg-primary",
														style: { width: pct + "%" }
													})
												})
											]
										}, item.id);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "panel p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-3 text-center font-display text-xl font-extrabold",
									children: "Diario"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiaryBody, {})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: toast ? "toast show" : "toast",
				role: "status",
				children: toast
			}),
			modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "scrim fixed inset-0 z-30 grid place-items-center p-4",
				onClick: () => setModal(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "dialog",
					"aria-modal": "true",
					className: "panel modal-card w-full max-w-md overflow-auto p-6 text-center",
					onClick: (event) => event.stopPropagation(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalBody, {
						modal,
						save,
						onClose: () => setModal(null),
						onNew: startNew,
						onReset: resetAll,
						onSound: () => {
							unlockAudio();
							dispatch({ type: "sound" });
						},
						onAskReset: () => setModal({ type: "confirm-reset" })
					})
				})
			}) : null
		]
	});
}
function ModalBody({ modal, save, onClose, onNew, onReset, onSound, onAskReset }) {
	if (modal.type === "offline") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-extrabold",
			children: "Bienvenido de nuevo"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2",
			children: "Tu amor siguió creciendo mientras estabas fuera."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 font-black",
			children: ["Tiempo offline: ", timeFmt(modal.counted)]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xl font-black",
			children: ["Ganaste ", fmt(modal.reward)]
		}),
		modal.capped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Se cuentan como máximo 8 horas."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onClose,
			children: "Reclamar"
		})
	] });
	if (modal.type === "achievements") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-extrabold",
			children: "Logros"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 grid gap-3 text-left",
			children: ACHIEVEMENTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [save.achievements[item.id] ? "Listo · " : "", item.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm text-muted",
				children: item.detail
			})] }, item.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onClose,
			children: "Cerrar"
		})
	] });
	if (modal.type === "pets") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: michi_default,
			alt: "",
			className: "mx-auto h-28 w-28 rounded-full object-cover"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-2 font-display text-2xl font-extrabold",
			children: "Michi"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Nivel ", save.michi ? save.michiLevel : 0] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm",
			children: "Las mascotas generan Lovecoins cada segundo y también mejoran tus clics."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onClose,
			children: "Cerrar"
		})
	] });
	if (modal.type === "diary") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-extrabold",
			children: "Diario"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-left",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiaryBody, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onClose,
			children: "Cerrar"
		})
	] });
	if (modal.type === "credits") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-extrabold",
			children: "Créditos"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 font-black",
			children: "Maria Haide Idle Love"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2",
			children: "Un pequeño juego hecho con amor para María Haide."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onClose,
			children: "Cerrar"
		})
	] });
	if (modal.type === "settings") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-extrabold",
			children: "Ajustes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3",
			children: ["Sonido: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: save.sound ? "Activado" : "Desactivado" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onSound,
			children: save.sound ? "Silenciar" : "Activar sonido"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onClose,
			children: "Cerrar"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "menu-btn mx-auto mt-3",
			onClick: onAskReset,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
				className: "size-4",
				"aria-hidden": "true"
			}), " Reiniciar progreso"]
		})
	] });
	if (modal.type === "confirm-new") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-extrabold",
			children: "¿Nueva partida?"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2",
			children: "Esto borra el progreso guardado en este navegador."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onNew,
			children: "Empezar de cero"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onClose,
			children: "Cancelar"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-extrabold",
			children: "¿Borrar todo?"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2",
			children: "Se pierde el amor, Michi y los logros de esta partida."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "claim",
			onClick: onReset,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
				className: "mr-1 inline size-4",
				"aria-hidden": "true"
			}), " Sí, reiniciar"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "claim",
			onClick: onClose,
			children: "Cancelar"
		})
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdleLove, {});
}
//#endregion
export { Home as component };
