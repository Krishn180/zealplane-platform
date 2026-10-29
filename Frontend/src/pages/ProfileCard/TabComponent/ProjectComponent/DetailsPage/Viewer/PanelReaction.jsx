import { useState, useEffect, useRef } from "react";

// Emoji reactions, one per page (deterministic, not random)
const REACTIONS = ["🔥", "😮", "❤️", "🤯", "👏", "⚡", "💥", "✨", "😱", "🎯"];

/**
 * PanelReaction — floats a reaction emoji up from the top of a comic page
 * when that page first enters the viewport.
 * Props:
 *   pageIndex    {number}          — which page index this belongs to
 *   containerRef {React.RefObject} — the scroll container (for IO root)
 *   imgRef       {React.RefObject} — ref to the <img> element to observe
 */
const PanelReaction = ({ pageIndex, containerRef, imgRef }) => {
  const [visible, setVisible] = useState(false);
  const firedRef  = useRef(false);
  const ioRef     = useRef(null);
  const emoji = REACTIONS[pageIndex % REACTIONS.length];

  useEffect(() => {
    if (firedRef.current) return;

    // Poll until the image element is actually in the DOM
    // (imageRefs.current[index] may not be ready on first render)
    let retries = 0;
    const MAX_RETRIES = 20;

    const tryObserve = () => {
      const el = imgRef?.current;
      if (!el) {
        if (retries++ < MAX_RETRIES) {
          setTimeout(tryObserve, 150);
        }
        return;
      }

      ioRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !firedRef.current) {
            firedRef.current = true;
            setVisible(true);
            ioRef.current?.disconnect();
            setTimeout(() => setVisible(false), 2800);
          }
        },
        { root: containerRef?.current || null, threshold: [0.35, 0.6] }
      );
      ioRef.current.observe(el);
    };

    // Short delay so the img ref is populated after first render
    const t = setTimeout(tryObserve, 200);
    return () => {
      clearTimeout(t);
      ioRef.current?.disconnect();
    };
  }, []); // intentionally empty — runs once per mount

  if (!visible) return null;

  return (
    <div className="pr-reaction" aria-hidden="true">
      {emoji}
    </div>
  );
};

export default PanelReaction;
