import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import BlueprintModal from "./BlueprintModal";

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

  return (
    <BlueprintModal onClose={onClose} show={show}>
      <div className="modal__header">
        <h2 className="modal__title">{title}</h2>
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
    </BlueprintModal>
  );
};

export default DeleteModal;
