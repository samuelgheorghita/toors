import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import crossIcon from "../../images/icons/cross-svgrepo-com.svg";

const BlueprintModal = ({ children, onClose, show }) => {
  const modalRef = useRef(null);

  const handleKeyboard = (e) => {
    if (e.key === "Escape") {
      onClose(e);
    } else if (e.key === "Tab") {
      handleTabKey(e);
    }
  };

  const handleTabKey = (e) => {
    // Following line is to avoid conflict between the 2 modals in this page
    if (!modalRef.current) return;

    const focusableModalElements = Array.from(
      modalRef.current.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select')
    );
    const firstElement = focusableModalElements[0];
    const lastElement = focusableModalElements[focusableModalElements.length - 1];

    console.log(document.activeElement);

    if (!focusableModalElements.includes(document.activeElement)) {
      firstElement.focus();
      return e.preventDefault();
    }

    if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      return e.preventDefault();
    }

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyboard);
    return function cleanup() {
      document.body.removeEventListener("keydown", handleKeyboard);
    };
  });

  return ReactDOM.createPortal(
    <CSSTransition in={show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
      <div className="modal" onClick={onClose} ref={modalRef}>
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
