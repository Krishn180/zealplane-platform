import { useState, useEffect, useRef } from "react";

// Milestone definitions — messages fire as reader progresses through the comic
const MILESTONES = [
  {
    pct  : 25,
    text : "🔥 The world is opening up... don't stop now.",
    color: "#ff9900",
  },
  {
    pct  : 50,
    text : "⚡ Halfway in — everything you think you know is about to change.",
    color: "#ffcc00",
  },
  {
    pct  : 75,
    text : "🎯 Three quarters through — the truth is almost revealed...",
    color: "#00ccff",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
const ViewerMilestone = ({ progressPercentage }) => {
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const seenRef  = useRef(new Set());
  const timerRef = useRef(null);

  useEffect(() => {
    // Find the highest unshown milestone that's been reached
    const hit = [...MILESTONES]
      .reverse()
      .find(m => progressPercentage >= m.pct && !seenRef.current.has(m.pct));

    if (!hit) return;

    seenRef.current.add(hit.pct);
    setLeaving(false);
    setCurrent(hit);

    clearTimeout(timerRef.current);
    // Start exit animation after 3.5 seconds
    timerRef.current = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => setCurrent(null), 380);
    }, 3500);

    return () => clearTimeout(timerRef.current);
  }, [progressPercentage]);

  if (!current) return null;

  return (
    <div
      className={`ve-milestone ${leaving ? "ve-milestone--out" : ""}`}
      style={{ "--mc": current.color }}
      role="status"
      aria-live="polite"
      aria-label={current.text}
    >
      <span className="ve-milestone__text">{current.text}</span>
      <div className="ve-milestone__bar" aria-hidden="true" />
    </div>
  );
};

export default ViewerMilestone;
