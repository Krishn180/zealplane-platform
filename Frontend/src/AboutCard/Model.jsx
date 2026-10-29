import React from "react";
import ReactDOM from "react-dom";
import "../AboutCard/ModelStyle.css";

const Modal = ({ show, handleClose, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay-aboutCard" onClick={handleClose}>
      <div
        className="modal-content-aboutCard"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
