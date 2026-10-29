import { BookOpen } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Shows when a reader returns to a comic they previously read partway through.
// ─────────────────────────────────────────────────────────────────────────────
const ViewerResumeModal = ({ isOpen, savedPage, totalPages, onResume, onStartOver }) => {
  if (!isOpen || savedPage == null || savedPage <= 0) return null;

  return (
    <div
      className="ve-resume"
      role="dialog"
      aria-modal="true"
      aria-label="Resume reading"
    >
      <div className="ve-resume__card">
        <div className="ve-resume__icon-wrapper" style={{ color: "#ff4500", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
          <BookOpen size={44} />
        </div>

        <p className="ve-resume__text">
          Welcome back! You left off on{" "}
          <strong>Page {savedPage + 1}</strong>
          {totalPages ? ` of ${totalPages}` : ""}.
        </p>

        <div className="ve-resume__actions">
          <button
            className="ve-btn ve-btn--primary"
            onClick={onResume}
            autoFocus
          >
            Resume from Page {savedPage + 1} →
          </button>
          <button className="ve-btn ve-btn--ghost" onClick={onStartOver}>
            Start from the beginning
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewerResumeModal;
