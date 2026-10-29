import { useState, useRef, useEffect, useCallback } from "react";
import { Music2, VolumeX, Volume1, Volume2, ChevronDown, ChevronUp } from "lucide-react";
import "./AmbientPlayer.scss";

// ─── Preset definitions ───────────────────────────────────────────────────────
const PRESETS = [
  { id: "dark",   emoji: "🌑", label: "Dark",   desc: "Noir Drone",    accent: "#7c3aed" },
  { id: "action", emoji: "⚔️",  label: "Action", desc: "Epic Tension",  accent: "#dc2626" },
  { id: "calm",   emoji: "🌿", label: "Calm",   desc: "Soft Ambient",  accent: "#059669" },
  { id: "lofi",   emoji: "🎌", label: "Lo-Fi",  desc: "Study Vibes",   accent: "#d97706" },
];

// ─── Web Audio synth engine ───────────────────────────────────────────────────
function buildSynth(ctx, masterGain, type) {
  const nodes = [];

  // Brown noise generator (warm, low-freq heavy texture)
  const makeBrownNoise = (filterFreq = 800, level = 0.04) => {
    const bufSec = 3;
    const buf = ctx.createBuffer(1, ctx.sampleRate * bufSec, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < buf.length; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // normalize loudness
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = filterFreq;
    const g = ctx.createGain();
    g.gain.value = level;
    src.connect(filt);
    filt.connect(g);
    g.connect(masterGain);
    src.start();
    nodes.push(src);
  };

  // High-frequency vinyl crackle / hiss
  const makeHiss = (filterFreq = 5000, filterQ = 0.8, level = 0.008) => {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < buf.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.value = filterFreq;
    filt.Q.value = filterQ;
    const g = ctx.createGain();
    g.gain.value = level;
    src.connect(filt);
    filt.connect(g);
    g.connect(masterGain);
    src.start();
    nodes.push(src);
    return { g };
  };

  // Oscillator tone with optional LFO tremolo
  const makeOsc = (freq, wave = "sine", level = 0.1, detune = 0) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = wave;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    g.gain.value = level;
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    nodes.push(osc);
    return { osc, g };
  };

  // LFO that modulates a gain (creates tremolo/pulse)
  const makeLFO = (freq, targetGainNode, minVal, maxVal) => {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = freq;
    const mid = (minVal + maxVal) / 2;
    const amp = (maxVal - minVal) / 2;
    lfoGain.gain.value = amp;
    targetGainNode.gain.value = mid;
    lfo.connect(lfoGain);
    lfoGain.connect(targetGainNode.gain);
    lfo.start();
    nodes.push(lfo);
  };

  switch (type) {
    case "dark": {
      // Deep drone — noir atmospheric hum with beating oscillators
      makeOsc(55, "sine", 0.22);         // fundamental
      makeOsc(57.3, "sine", 0.14);       // slight detuning → beating
      makeOsc(27.5, "sine", 0.07);       // sub bass
      makeOsc(110, "sine", 0.05, -8);    // first harmonic
      makeBrownNoise(600, 0.035);        // warm low hum
      makeHiss(8000, 0.4, 0.006);        // distant rain hiss
      break;
    }
    case "action": {
      // Tension loop — pulsing bass + high string harmonics
      const bass = makeOsc(82.4, "sine", 0.0);   // E2 bass (started at 0)
      const str1 = makeOsc(440, "sine", 0.015, -7);   // tension A4
      const str2 = makeOsc(441.8, "sine", 0.015, 7);  // slightly detuned → string shimmer
      makeLFO(1.8, bass.g, 0.04, 0.22);              // 1.8Hz pulse → ~108 BPM
      makeLFO(0.45, str1.g, 0.008, 0.02);            // slow bow tremolo
      makeOsc(220, "sawtooth", 0.018);                // cello-like mid
      makeHiss(3500, 2, 0.014);                       // tension hiss
      makeBrownNoise(400, 0.02);                      // room rumble
      break;
    }
    case "calm": {
      // C major ambient pad — soft and spacious
      const c3  = makeOsc(130.81, "triangle", 0.12); // C3
      const e3  = makeOsc(164.81, "triangle", 0.10); // E3
      const g3  = makeOsc(196.00, "triangle", 0.09); // G3
      const c4  = makeOsc(261.63, "sine",     0.07); // C4
      const e4  = makeOsc(329.63, "sine",     0.04); // E4 (high shimmer)
      makeLFO(0.18, c3.g, 0.07, 0.14);               // very slow breathing
      makeLFO(0.22, e3.g, 0.06, 0.12);
      makeLFO(0.15, c4.g, 0.03, 0.09);
      makeBrownNoise(300, 0.018);                     // soft air texture
      break;
    }
    case "lofi": {
      // A minor chord — warm vintage hum
      makeOsc(110.00, "sine",     0.16); // A2
      makeOsc(130.81, "triangle", 0.11); // C3
      makeOsc(164.81, "sine",     0.10); // E3
      makeOsc(220.00, "sine",     0.07); // A3
      makeOsc(261.63, "triangle", 0.04); // C4 (subtle)
      makeHiss(5500, 0.3, 0.009);        // vinyl crackle texture
      makeBrownNoise(500, 0.022);        // warm room
      // Vibrato on A3
      const vib = makeOsc(220, "sine", 0.03);
      makeLFO(5.5, vib.g, 0.02, 0.05);
      break;
    }
    default: break;
  }

  return () => {
    nodes.forEach((n) => { try { n.stop(); } catch (_) {} });
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
const AmbientPlayer = ({ visible }) => {
  const [expanded,    setExpanded]    = useState(false);
  const [playing,     setPlaying]     = useState(false);
  const [preset,      setPreset]      = useState("dark");
  const [volume,      setVolume]      = useState(0.35);
  const [nudgeShown,  setNudgeShown]  = useState(false);

  const ctxRef        = useRef(null);
  const masterRef     = useRef(null);
  const stopSynthRef  = useRef(null);
  const fadeTimerRef  = useRef(null);

  // ── init / resume AudioContext ─────────────────────────────────────
  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = 0;
      masterRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
  }, []);

  // ── fade gain in/out ───────────────────────────────────────────────
  const fadeTo = useCallback((targetVol, durationSec = 1.2) => {
    if (!masterRef.current || !ctxRef.current) return;
    const g = masterRef.current.gain;
    g.cancelScheduledValues(ctxRef.current.currentTime);
    g.setValueAtTime(g.value, ctxRef.current.currentTime);
    g.linearRampToValueAtTime(targetVol, ctxRef.current.currentTime + durationSec);
  }, []);

  // ── start synth for given preset ──────────────────────────────────
  const startSynth = useCallback((id, vol) => {
    if (!ctxRef.current) return;
    if (stopSynthRef.current) { stopSynthRef.current(); stopSynthRef.current = null; }
    stopSynthRef.current = buildSynth(ctxRef.current, masterRef.current, id);
    fadeTo(vol, 1.4);
  }, [fadeTo]);

  // ── stop all synth nodes ──────────────────────────────────────────
  const stopAll = useCallback((instant = false) => {
    if (!masterRef.current || !ctxRef.current) return;
    if (instant) {
      if (stopSynthRef.current) { stopSynthRef.current(); stopSynthRef.current = null; }
      masterRef.current.gain.value = 0;
    } else {
      fadeTo(0, 1.0);
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => {
        if (stopSynthRef.current) { stopSynthRef.current(); stopSynthRef.current = null; }
      }, 1200);
    }
  }, [fadeTo]);

  // ── toggle play/pause ─────────────────────────────────────────────
  const toggle = useCallback(() => {
    ensureCtx();
    if (playing) {
      stopAll(false);
      setPlaying(false);
    } else {
      startSynth(preset, volume);
      setPlaying(true);
    }
  }, [playing, preset, volume, ensureCtx, startSynth, stopAll]);

  // ── switch preset (crossfade) ─────────────────────────────────────
  const switchPreset = useCallback((id) => {
    setPreset(id);
    if (playing) {
      ensureCtx();
      fadeTo(0, 0.6);
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => {
        if (stopSynthRef.current) { stopSynthRef.current(); stopSynthRef.current = null; }
        if (ctxRef.current) {
          stopSynthRef.current = buildSynth(ctxRef.current, masterRef.current, id);
          fadeTo(volume, 0.8);
        }
      }, 700);
    }
  }, [playing, volume, ensureCtx, fadeTo]);

  // ── volume change ─────────────────────────────────────────────────
  const handleVolume = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
      masterRef.current.gain.setValueAtTime(v, ctxRef.current.currentTime);
    }
  }, []);

  // ── show nudge once after 8s ───────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setNudgeShown(true), 8000);
    const t2 = setTimeout(() => setNudgeShown(false), 14000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [visible]);

  // ── cleanup on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopAll(true);
      clearTimeout(fadeTimerRef.current);
      ctxRef.current?.close();
    };
  }, [stopAll]);

  if (!visible) return null;

  const currentPreset = PRESETS.find((p) => p.id === preset) || PRESETS[0];

  return (
    <div
      className={`ap-root ${expanded ? "ap-root--expanded" : ""} ${playing ? "ap-root--playing" : ""}`}
      style={{ "--ap-accent": currentPreset.accent }}
    >
      {/* Music nudge tooltip */}
      {nudgeShown && !playing && !expanded && (
        <div className="ap-nudge" onClick={() => setExpanded(true)}>
          🎵 Ambient music available
        </div>
      )}

      {/* Collapsed pill header */}
      <div className="ap-header" onClick={() => setExpanded((v) => !v)}>
        <span className="ap-header__emoji">{currentPreset.emoji}</span>
        <span className="ap-header__label">
          {playing ? currentPreset.desc : "Ambience"}
        </span>
        {playing && <span className="ap-header__bars"><span/><span/><span/></span>}
        {expanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="ap-panel">
          {/* Preset grid */}
          <div className="ap-presets">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                className={`ap-preset-btn ${preset === p.id ? "active" : ""}`}
                style={{ "--ap-preset-accent": p.accent }}
                onClick={() => switchPreset(p.id)}
              >
                <span className="ap-preset-btn__emoji">{p.emoji}</span>
                <span className="ap-preset-btn__name">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Volume + play controls */}
          <div className="ap-controls">
            <button
              className={`ap-play-btn ${playing ? "playing" : ""}`}
              onClick={toggle}
              aria-label={playing ? "Pause ambient music" : "Play ambient music"}
            >
              {playing ? (
                <>
                  <VolumeX size={15} strokeWidth={2} />
                  <span>Mute</span>
                </>
              ) : (
                <>
                  <Music2 size={15} strokeWidth={2} />
                  <span>Play</span>
                </>
              )}
            </button>

            <div className="ap-vol">
              {volume < 0.01 ? (
                <VolumeX size={13} className="ap-vol__icon" strokeWidth={2} />
              ) : volume < 0.5 ? (
                <Volume1 size={13} className="ap-vol__icon" strokeWidth={2} />
              ) : (
                <Volume2 size={13} className="ap-vol__icon" strokeWidth={2} />
              )}
              <input
                type="range"
                className="ap-vol__slider"
                min="0" max="1" step="0.02"
                value={volume}
                onChange={handleVolume}
                aria-label="Volume"
              />
            </div>
          </div>

          <p className="ap-caption">
            {playing
              ? `Playing: ${currentPreset.emoji} ${currentPreset.desc}`
              : "Tap Play to immerse yourself in the story ✨"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AmbientPlayer;
