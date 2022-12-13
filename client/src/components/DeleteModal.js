import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

const DeleteModal = ({ children, onClose, onDelete, show, title }) => {
  const closeOnEscapeKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  });

  return ReactDOM.createPortal(
    <CSSTransition in={show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
      <div className="modal" onClick={onClose}>
        <div className="modal__content" onClick={(e) => e.stopPropagation()}>
          <div className="modal__header">
            <h4 className="modal__title">{title}</h4>
          </div>
          {children && <div className="modal__body">{children}</div>}
          <div className="modal__footer">
            <button className="btn modal__cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn modal__btn" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default DeleteModal;
