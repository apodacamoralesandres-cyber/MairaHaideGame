let ctx: AudioContext | null = null;
let sfx: GainNode | null = null;

function ensure(): AudioContext | null {
  if (ctx) return ctx;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  ctx = new AudioCtx({ latencyHint: "interactive" });
  const master = ctx.createGain();
  sfx = ctx.createGain();
  sfx.gain.value = 1;
  master.gain.value = 0.9;
  sfx.connect(master);
  master.connect(ctx.destination);
  return ctx;
}

/** Call synchronously inside a tap or key press. iOS stays silent otherwise. */
export function unlockAudio() {
  const audio = ensure();
  if (audio && audio.state === "suspended") void audio.resume();
}

export function resumeAudio() {
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

export function beep(freq: number) {
  if (!ctx || ctx.state !== "running" || !sfx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(sfx);
  const start = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.045, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
  osc.start(start);
  osc.stop(start + 0.13);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}
