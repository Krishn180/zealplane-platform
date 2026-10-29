import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./GamifiedLoader.scss";

// ── tuning constants ────────────────────────────────────────────────────────
const MAX_CHARGE   = 100;
const CHARGE_PRESS = 7;    // added per spacebar / tap
const DECAY_RATE   = 0.22; // per RAF frame @ ~60fps → ~13%/sec decay
const FILL_SPEED   = 8;    // per 16ms interval when auto-filling → ~200ms to fill

let _pid = 0;
const mkParticle = () => ({
  id: ++_pid,
  x : 28 + Math.random() * 44,
  y : 15 + Math.random() * 55,
});

// ────────────────────────────────────────────────────────────────────────────
const GamifiedLoader = ({ loading }) => {
  const [charge,  setCharge]  = useState(0);
  const [phase,   setPhase]   = useState("charging");
  const [hits,    setHits]    = useState([]);
  const [shake,   setShake]   = useState(false);
  const [visible, setVisible] = useState(true);
  const [theme,   setTheme]   = useState("superhero"); // superhero, cyborg_cannon, wizard_spell

  // refs — avoid stale closures without extra re-renders
  const chargeRef   = useRef(0);
  const lastEmitted = useRef(0);   // ← throttle: only setState when rounded value changes
  const phaseRef    = useRef("charging");
  const rafRef      = useRef(null);
  const doneRef     = useRef(false);
  const shakeTimer  = useRef(null);

  // Randomize theme on mount
  useEffect(() => {
    const themes = ["superhero", "cyborg_cannon", "wizard_spell", "dark_samurai"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(randomTheme);
  }, []);

  // ── unleash ────────────────────────────────────────────────────────────────
  const triggerUnleash = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current   = true;
    phaseRef.current  = "unleashing";
    chargeRef.current = 100;
    lastEmitted.current = 100;
    setPhase("unleashing");
    setCharge(100);
    setTimeout(() => setVisible(false), 1300);
  }, []);

  // ── THROTTLED RAF decay loop ───────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      if (phaseRef.current === "charging" && chargeRef.current > 0) {
        chargeRef.current = Math.max(0, chargeRef.current - DECAY_RATE);
        const rounded = Math.round(chargeRef.current);
        if (rounded !== lastEmitted.current) {
          lastEmitted.current = rounded;
          setCharge(rounded);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── FAST auto-fill when comic images are ready ────────────────────────────
  useEffect(() => {
    if (!loading && !doneRef.current) {
      const id = setInterval(() => {
        chargeRef.current = Math.min(100, chargeRef.current + FILL_SPEED);
        const rounded = Math.round(chargeRef.current);
        if (rounded !== lastEmitted.current) {
          lastEmitted.current = rounded;
          setCharge(rounded);
        }
        if (chargeRef.current >= 100) {
          clearInterval(id);
          setTimeout(triggerUnleash, 220);
        }
      }, 16);
      return () => clearInterval(id);
    }
  }, [loading, triggerUnleash]);

  // ── shared charge logic ────────────────────────────────────────────────────
  const addCharge = useCallback(() => {
    if (phaseRef.current !== "charging") return;

    chargeRef.current = Math.min(MAX_CHARGE, chargeRef.current + CHARGE_PRESS);
    const rounded = Math.round(chargeRef.current);
    lastEmitted.current = rounded;
    setCharge(rounded);

    // screen shake
    setShake(true);
    clearTimeout(shakeTimer.current);
    shakeTimer.current = setTimeout(() => setShake(false), 110);

    // floating "+N" burst
    const p = mkParticle();
    setHits(prev => [...prev.slice(-7), p]);
    setTimeout(() => setHits(prev => prev.filter(h => h.id !== p.id)), 750);

    if (chargeRef.current >= MAX_CHARGE) triggerUnleash();
  }, [triggerUnleash]);

  // ── keyboard listener ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || phase !== "charging") return;

    const onKey = (e) => { 
      if (e.code === "Space") { 
        e.preventDefault(); 
        addCharge(); 
      } 
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addCharge, visible, phase]);

  // Derived display values
  const pct       = charge;
  const hue       = theme === "wizard_spell" ? 220 + pct
                  : theme === "cyborg_cannon" ? 170 + pct * 0.8
                  : theme === "dark_samurai"  ? 330 + pct * 0.3   // red → magenta
                  : 20 + pct;                                      // superhero: gold
  const glow      = pct / 100;
  const charColor = `hsl(${hue}, 100%, 58%)`;
  const eyeColor  = pct > 60 ? charColor : "#111";

  // Per-theme background tint (subtle – keeps dark feel, just enough to differ)
  const bgTint = theme === "wizard_spell"  ? "rgba(20,10,60,0.97)"
               : theme === "cyborg_cannon" ? "rgba(5,20,25,0.97)"
               : theme === "dark_samurai"  ? "rgba(30,5,10,0.97)"
               : "rgba(5,5,16,0.97)"; // superhero

  // ── 1. SUPERHERO STATIC SVG ────────────────────────────────────────────────
  const superheroStaticSVG = useMemo(() => (
    <>
      {/* cape strokes */}
      <path d="M37,82 Q7,142 15,197"  stroke="#700" strokeWidth="3.5" fill="none" />
      <path d="M83,82 Q113,142 105,197" stroke="#700" strokeWidth="3.5" fill="none" />
      {/* arms */}
      <path d="M38,96 Q19,110 6,120"   stroke="#1a1a2e" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M82,96 Q101,110 114,120" stroke="#1a1a2e" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* torso */}
      <rect x="37" y="80" width="46" height="64" rx="7" fill="#1a1a2e" />
      {/* belt strap */}
      <rect x="37" y="134" width="46" height="10" rx="3" fill="#0d0d1a" />
      {/* head */}
      <circle cx="60" cy="56" r="21" fill="#e8a87c" />
      {/* helmet dome */}
      <path d="M41,50 Q60,30 79,50 Q79,39 60,34 Q41,39 41,50Z" fill="#1a1a2e" />
      {/* chin mask */}
      <path d="M40,62 Q60,52 80,62" stroke="#1a1a2e" strokeWidth="2.5" fill="none" />
      {/* white eye sclera */}
      <ellipse cx="50" cy="55" rx="6.5" ry="5.5" fill="white" />
      <ellipse cx="70" cy="55" rx="6.5" ry="5.5" fill="white" />
      {/* legs */}
      <path d="M48,144 Q45,177 43,218" stroke="#1a1a2e" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M72,144 Q75,177 77,218" stroke="#1a1a2e" strokeWidth="11" strokeLinecap="round" fill="none" />
      {/* boots */}
      <ellipse cx="43" cy="219" rx="9" ry="4.5" fill="#0d0d1a" />
      <ellipse cx="77" cy="219" rx="9" ry="4.5" fill="#0d0d1a" />
    </>
  ), []);

  // ── 2. CYBORG CANNON STATIC SVG ────────────────────────────────────────────
  const cyborgStaticSVG = useMemo(() => (
    <>
      {/* robotic legs */}
      <path d="M48,144 Q45,177 43,218" stroke="#34495e" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M72,144 Q75,177 77,218" stroke="#34495e" strokeWidth="11" strokeLinecap="round" fill="none" />
      {/* hydraulic feet */}
      <rect x="33" y="214" width="20" height="10" rx="2" fill="#2c3e50" />
      <rect x="67" y="214" width="20" height="10" rx="2" fill="#2c3e50" />
      {/* cyborg heavy torso */}
      <rect x="38" y="80" width="44" height="64" rx="8" fill="#2c3e50" stroke="#7f8c8d" strokeWidth="2" />
      {/* armor plating */}
      <rect x="46" y="90" width="28" height="30" rx="3" fill="#34495e" />
      {/* shoulder pads */}
      <circle cx="36" cy="88" r="10" fill="#7f8c8d" />
      <circle cx="84" cy="88" r="10" fill="#7f8c8d" />
      {/* arm cannon */}
      <path d="M36,88 Q20,130 50,150" stroke="#34495e" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M84,88 Q100,130 70,150" stroke="#34495e" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* cannon barrel */}
      <rect x="52" y="136" width="16" height="24" rx="4" fill="#1a252f" stroke="#7f8c8d" strokeWidth="1.5" />
      {/* cyborg head / helmet */}
      <circle cx="60" cy="52" r="18" fill="#7f8c8d" />
      <rect x="48" y="44" width="24" height="10" rx="2" fill="#2c3e50" />
      {/* visor background */}
      <rect x="50" y="46" width="20" height="6" rx="1" fill="#111" />
    </>
  ), []);

  // ── 3. WIZARD STAFF STATIC SVG ─────────────────────────────────────────────
  const wizardStaticSVG = useMemo(() => (
    <>
      {/* wizard long robe */}
      <path d="M35,82 L15,218 L105,218 L85,82 Z" fill="#2c3e50" stroke="#1a252f" strokeWidth="2" />
      {/* sash belt */}
      <rect x="36" y="130" width="48" height="8" rx="2" fill="#d35400" />
      {/* wizard head (bearded) */}
      <circle cx="60" cy="54" r="17" fill="#e8a87c" />
      {/* long white beard */}
      <polygon points="46,62 74,62 60,110" fill="#ecf0f1" />
      {/* wizard pointy hat */}
      <polygon points="60,10 38,48 82,48" fill="#1b263b" />
      {/* hat brim */}
      <ellipse cx="60" cy="46" rx="26" ry="5" fill="#2c3e50" />
      {/* staff held in hand pointing to the left */}
      <line x1="20" y1="40" x2="48" y2="180" stroke="#7e5109" strokeWidth="4" strokeLinecap="round" />
      {/* wizard sleeve / hand holding staff */}
      <circle cx="36" cy="120" r="7" fill="#e8a87c" />
      <path d="M50,82 Q32,100 36,120" stroke="#2c3e50" strokeWidth="8" strokeLinecap="round" fill="none" />
    </>
  ), []);

  // ── 4. DARK SAMURAI STATIC SVG ─────────────────────────────────────────────
  const samuraiStaticSVG = useMemo(() => (
    <>
      {/* hakama (wide flared trousers) */}
      <path d="M36,130 L20,218 L52,218 L60,155 L68,218 L100,218 L84,130 Z" fill="#1a0a0a" stroke="#3d0000" strokeWidth="1.5" />
      {/* gi jacket body */}
      <rect x="37" y="78" width="46" height="56" rx="4" fill="#1c1c1c" />
      {/* lapel cross */}
      <line x1="60" y1="78" x2="44" y2="134" stroke="#3d0000" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="78" x2="76" y2="134" stroke="#3d0000" strokeWidth="3" strokeLinecap="round" />
      {/* obi sash */}
      <rect x="36" y="124" width="48" height="12" rx="2" fill="#5c0a0a" />
      {/* shoulder guards (sode) */}
      <rect x="22" y="78" width="18" height="24" rx="3" fill="#111" stroke="#3d0000" strokeWidth="1.5" />
      <rect x="80" y="78" width="18" height="24" rx="3" fill="#111" stroke="#3d0000" strokeWidth="1.5" />
      {/* arms */}
      <path d="M38,90 Q22,108 10,118" stroke="#1c1c1c" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M82,90 Q98,108 110,118" stroke="#1c1c1c" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* katana held in right hand (diagonal) */}
      <line x1="108" y1="122" x2="50" y2="30" stroke="#ccc" strokeWidth="3" strokeLinecap="round" />
      <rect x="96" y="116" width="18" height="8" rx="2" fill="#5c0a0a" />
      {/* head */}
      <circle cx="60" cy="52" r="18" fill="#c8956c" />
      {/* kabuto helmet */}
      <path d="M40,46 Q60,20 80,46 Q80,36 60,30 Q40,36 40,46Z" fill="#111" stroke="#3d0000" strokeWidth="1.5" />
      {/* cheek guards (fukigaeshi) */}
      <path d="M40,46 Q33,54 36,64" stroke="#1c1c1c" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M80,46 Q87,54 84,64" stroke="#1c1c1c" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* eye slit / mengu */}
      <rect x="47" y="52" width="26" height="5" rx="2" fill="#0a0a0a" />
    </>
  ), []);

  // ── HUD Text Customization ─────────────────────────────────────────────────
  const hudValues = useMemo(() => {
    if (theme === "cyborg_cannon") {
      return {
        title: "🔋 POWER ATTACK 🔋",
        action: "Injecting plasma...",
        btnLabel: "Smash to charge Cannon!"
      };
    } else if (theme === "wizard_spell") {
      return {
        title: "🔮 SPELL CONJURATION 🔮",
        action: "Invoking magic...",
        btnLabel: "Smash to cast spell!"
      };
    } else if (theme === "dark_samurai") {
      return {
        title: "⚔️ FOCUS YOUR KI ⚔️",
        action: "Channelling blade energy...",
        btnLabel: "Smash to draw your sword!"
      };
    }
    return {
      title: "⚡ CHARGE UP ⚡",
      action: "Charging power...",
      btnLabel: "Smash to charge!"
    };
  }, [theme]);

  if (!visible) return null;

  return (
    <div
      id="gamified-loader-root"
      className={`gl-root ${phase} ${shake ? "gl-shake" : ""} gl-theme-${theme}`}
      style={{ background: bgTint }}
      onClick={addCharge}
      role="button"
      tabIndex={-1}
      aria-label="Tap or press Space to charge — comic is loading"
    >
      {/* scanlines */}
      <div className="gl-scanlines" aria-hidden="true" />

      {/* viewport edge glow */}
      <div className="gl-edge-glow" aria-hidden="true"
        style={{ boxShadow: `inset 0 0 ${pct * 4}px hsl(${hue},100%,50%,${0.05 + glow * 0.18})` }}
      />

      {/* floating "+N" particles */}
      {hits.map(h => (
        <div key={h.id} className="gl-hit" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
          +{CHARGE_PRESS}
        </div>
      ))}

      {/* ════ MAIN ROW: character + power bar ═════════════════════════════════ */}
      <div className="gl-main" onClick={e => e.stopPropagation()}>

        {/* CHARACTER ARENA */}
        <div className="gl-arena">

          {/* aura rings — grow with charge */}
          {pct > 5 && (
            <div className="gl-auras" aria-hidden="true">
              {[1, 2, 3].map(i => pct > i * 20 && (
                <div key={i} className={`gl-aura gl-aura-${i}`}
                  style={{
                    width : `${60 + pct * i * 0.7}px`,
                    height: `${60 + pct * i * 0.7}px`,
                    borderColor: `hsl(${hue}, 100%, ${55 + i * 8}%, ${glow * 0.5 - i * 0.06})`,
                  }}
                />
              ))}
            </div>
          )}

          {/* ground energy halo */}
          <div className="gl-ground" aria-hidden="true"
            style={{ boxShadow: `0 0 ${pct * 2}px ${pct / 2}px hsl(${hue},100%,50%,0.18)` }}
          />

          {/* ── CHAR DESIGN SVG ────────────────────────────────────────────── */}
          <svg viewBox="0 0 120 232" className="gl-char" aria-hidden="true"
            style={{ filter: `drop-shadow(0 0 ${6 + pct * 0.38}px hsl(${hue},100%,60%,${0.25 + glow * 0.75}))` }}
          >
            {/* foot shadow */}
            <ellipse cx="60" cy="224" rx={10 + pct * 0.28} ry={3 + pct * 0.04} fill="rgba(0,0,0,0.55)" />

            {/* body inner aura (dynamic) */}
            {pct > 35 && (
              <ellipse cx="60" cy="130"
                rx={22 + pct * 0.28} ry={52 + pct * 0.28}
                fill={`hsl(${hue},100%,58%,${(pct - 35) * 0.0048})`}
              />
            )}

            {/* Theme 1: Superhero Rendering */}
            {theme === "superhero" && (
              <>
                {/* cape fill */}
                <path d="M37,82 Q60,102 83,82 Q113,142 105,197 Q60,180 15,197 Q7,142 37,82Z"
                  fill={`hsl(0,85%,${25 + pct * 0.1}%,0.42)`}
                />
                {superheroStaticSVG}
                {/* chest emblem */}
                <polygon points="60,88 68,99 60,97 52,99" fill={charColor} />
                <line x1="60" y1="97" x2="60" y2="128" stroke={charColor} strokeWidth="1.8" opacity="0.45" />
                {/* belt buckle */}
                <rect x="52" y="135" width="16" height="8" rx="2" fill={charColor} />
                {/* pupils */}
                <circle cx="50" cy="55" r={pct > 65 ? 3.5 : 2.4} fill={eyeColor} />
                <circle cx="70" cy="55" r={pct > 65 ? 3.5 : 2.4} fill={eyeColor} />
                {pct > 50 && (
                  <>
                    <ellipse cx="50" cy="55" rx="6.5" ry="5.5" fill={`hsl(${hue},100%,60%,${(pct-50)*0.009})`} />
                    <ellipse cx="70" cy="55" rx="6.5" ry="5.5" fill={`hsl(${hue},100%,60%,${(pct-50)*0.009})`} />
                  </>
                )}
                {/* energy orbs in hands */}
                {pct > 15 && (
                  <>
                    <circle cx="6"   cy="120" r={2.5 + pct * 0.068} fill={charColor} opacity="0.92" />
                    <circle cx="6"   cy="120" r={1   + pct * 0.04}  fill="white"     opacity="0.55" />
                    <circle cx="114" cy="120" r={2.5 + pct * 0.068} fill={charColor} opacity="0.92" />
                    <circle cx="114" cy="120" r={1   + pct * 0.04}  fill="white"     opacity="0.55" />
                  </>
                )}
              </>
            )}

            {/* Theme 2: Cyborg Cannon Rendering */}
            {theme === "cyborg_cannon" && (
              <>
                {cyborgStaticSVG}
                {/* visor light */}
                <rect x="50" y="46" width="20" height="6" rx="1" fill={pct > 20 ? charColor : "#222"} style={{ filter: pct > 20 ? `drop-shadow(0 0 4px ${charColor})` : "none" }} />
                {/* plasma sphere forming at muzzle */}
                {pct > 5 && (
                  <>
                    <circle cx="60" cy="160" r={3 + pct * 0.35} fill={charColor} opacity="0.85" />
                    <circle cx="60" cy="160" r={1.5 + pct * 0.18} fill="white" opacity="0.65" />
                  </>
                )}
                {/* sparks tier 1 */}
                {pct > 25 && (
                  <>
                    <polyline points="36,88 44,124 60,160" stroke={charColor} strokeWidth="1.6" fill="none" opacity="0.75" />
                    <polyline points="84,88 76,124 60,160" stroke={charColor} strokeWidth="1.6" fill="none" opacity="0.75" />
                  </>
                )}
              </>
            )}

            {/* Theme 3: Wizard Spell Rendering */}
            {theme === "wizard_spell" && (
              <>
                {wizardStaticSVG}
                {/* magic crystal glow at tip of staff */}
                <polygon points="20,18 28,28 20,38 12,28" fill={charColor} stroke="white" strokeWidth="0.8" />
                {/* floating magic sigil rings */}
                {pct > 15 && (
                  <circle cx="20" cy="28" r={5 + pct * 0.28} stroke={charColor} strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
                )}
                {pct > 45 && (
                  <circle cx="20" cy="28" r={10 + pct * 0.22} stroke="white" strokeWidth="1" strokeDasharray="5 2" fill="none" opacity="0.55" />
                )}
                {/* core energy sphere */}
                {pct > 5 && (
                  <circle cx="20" cy="28" r={1.5 + pct * 0.18} fill="white" opacity="0.75" />
                )}
              </>
            )}

            {/* Theme 4: Dark Samurai Rendering */}
            {theme === "dark_samurai" && (
              <>
                {samuraiStaticSVG}
                {/* eye slit glow */}
                <rect x="47" y="52" width="26" height="5" rx="2"
                  fill={pct > 15 ? charColor : "#0a0a0a"}
                  style={{ filter: pct > 15 ? `drop-shadow(0 0 4px ${charColor})` : "none" }}
                />
                {/* katana blade energy trail */}
                {pct > 10 && (
                  <line x1="108" y1="122" x2="50" y2="30"
                    stroke={charColor} strokeWidth={1 + pct * 0.025}
                    opacity={0.15 + pct * 0.008}
                  />
                )}
                {/* ki energy gathering at sword tip */}
                {pct > 20 && (
                  <>
                    <circle cx="50" cy="30" r={2 + pct * 0.22} fill={charColor} opacity="0.75" />
                    <circle cx="50" cy="30" r={1 + pct * 0.10} fill="white" opacity="0.55" />
                  </>
                )}
                {/* blade slash arcs at high charge */}
                {pct > 55 && (
                  <>
                    <path d="M30,20 Q55,45 80,25" stroke={charColor} strokeWidth="1.5" fill="none" opacity={0.4 + (pct-55)*0.012} strokeLinecap="round" />
                    <path d="M25,35 Q55,55 85,38" stroke="white" strokeWidth="1" fill="none" opacity={0.25 + (pct-55)*0.008} strokeLinecap="round" />
                  </>
                )}
                {/* rising ki wisps from feet */}
                {pct > 30 && (
                  <>
                    <path d="M43,218 Q38,185 44,160" stroke={charColor} strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
                    <path d="M77,218 Q82,185 76,160" stroke={charColor} strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
                  </>
                )}
              </>
            )}

            {/* Shared lightning sparks tier 2 */}
            {pct > 55 && (
              <>
                <polyline points="6,120 0,106 5,99 -1,86"         stroke="white" strokeWidth="1"   fill="none" opacity="0.7" />
                <polyline points="114,120 120,106 115,99 121,86"   stroke="white" strokeWidth="1"   fill="none" opacity="0.7" />
                <polyline points="6,120 12,133 5,139 12,152"       stroke={charColor} strokeWidth="1.3" fill="none" />
                <polyline points="114,120 108,133 115,139 108,152" stroke={charColor} strokeWidth="1.3" fill="none" />
              </>
            )}
            {/* Shared lightning sparks tier 3 */}
            {pct > 80 && (
              <>
                <polyline points="30,32 25,18 32,12 27,0"    stroke={charColor} strokeWidth="1.2" fill="none" opacity="0.8" />
                <polyline points="90,32 95,18 88,12 93,0"    stroke={charColor} strokeWidth="1.2" fill="none" opacity="0.8" />
              </>
            )}
          </svg>

          {/* unleash blast rings */}
          {phase === "unleashing" && (
            <>
              <div className="gl-blast gl-blast-1" />
              <div className="gl-blast gl-blast-2" />
              <div className="gl-blast gl-blast-3" />
              <div className="gl-flash"            />
            </>
          )}
        </div>

        {/* POWER BAR */}
        <div className="gl-power-bar" aria-label={`Power: ${pct}%`}>
          <span className="gl-pb-label">POWER</span>
          <div className="gl-pb-track">
            <div className="gl-pb-fill" style={{
              height    : `${pct}%`,
              background: `linear-gradient(to top, hsl(${hue-15},100%,44%), hsl(${hue+22},100%,68%))`
            }} />
            <div className="gl-pb-shine" style={{ bottom: `${pct}%`, opacity: pct > 2 ? 1 : 0 }} />
            {[75, 50, 25].map(m => (
              <div key={m} className="gl-pb-notch" style={{ bottom: `${m}%` }}>
                <span className="gl-pb-notch-txt">{m}%</span>
              </div>
            ))}
          </div>
          <span className="gl-pb-pct" style={{ color: charColor }}>{pct}%</span>
        </div>
      </div>

      {/* HUD */}
      <div className="gl-hud" aria-live="polite">
        {phase !== "unleashing" ? (
          <>
            <div className="gl-hud-title" aria-hidden="true">{hudValues.title}</div>
            {pct < 100 ? (
              <div className="gl-hud-action">
                <div className="gl-key-badge" aria-hidden="true">SPACE</div>
                <span className="gl-key-text">{hudValues.btnLabel}</span>
                <span className="gl-tap-hint">(tap on mobile)</span>
              </div>
            ) : (
              <div className="gl-hud-full">⚡ FULLY CHARGED! ⚡</div>
            )}
            <div className="gl-hud-loading">
              {loading
                ? "⏳ Loading your comic in the background…"
                : "✅ Comic ready — unleashing!"}
            </div>
          </>
        ) : (
          <div className="gl-hud-unleash">U&nbsp;N&nbsp;L&nbsp;E&nbsp;A&nbsp;S&nbsp;H&nbsp;!!!</div>
        )}
      </div>
    </div>
  );
};

export default GamifiedLoader;
