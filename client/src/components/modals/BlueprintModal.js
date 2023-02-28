import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import crossIcon from "../../images/icons/cross-svgrepo-com.svg";
// import crossIcon from "../../images/icons";

const BlueprintModal = ({ children, onClose, show }) => {
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
          <button className="modal__close-btn" onClick={onClose}>
            <img src={crossIcon} alt="close modal icon" />
          </button>
          {children}
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default BlueprintModal;
