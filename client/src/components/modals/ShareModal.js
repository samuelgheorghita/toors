import React, { useRef, useState } from "react";
import BlueprintModal from "./BlueprintModal";
import copyIcon from "../../images/icons/copy-normal-svgrepo-com.svg";
import copyIconSuccess from "../../images/icons/copy-success-svgrepo-com.svg";
import { useLocation } from "react-router-dom";
import { baseURL } from "../../apis/globalApi";

const ShareModal = ({ onClose, show }) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const linkRef = useRef(null);
  let timeout;
  const currentURL = useLocation();

  const handleCopyBtn = (e) => {
    setIsLinkCopied(true);
    copyLink();

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      setIsLinkCopied(false);
    }, 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(linkRef.current.innerText);
  };

  const copyAndClose = () => {
    copyLink();
    onClose();
  };

  return (
    <BlueprintModal onClose={onClose} show={show}>
      <div className="share-modal__header modal__header ">
        <h2 className="modal__title">Share</h2>
      </div>
      <div className="share-modal__body modal__body">
        <span className="share-modal__link" ref={linkRef}>
          {baseURL + currentURL.pathname}
        </span>
        <button className="share-modal__copy-btn" onClick={handleCopyBtn} title="copy">
          {isLinkCopied ? (
            <img src={copyIconSuccess} alt="successful copy icon" className="share-modal__copy-icon" />
          ) : (
            <img src={copyIcon} className="share-modal__copy-icon" alt="copy icon" />
          )}
        </button>
      </div>
      <div className="share-modal__footer modal__footer">
        <button className="btn modal__cancel-btn" onClick={onClose}>
          Cancel
        </button>
        <button className="btn modal__btn" onClick={copyAndClose}>
          Copy
        </button>
      </div>
    </BlueprintModal>
  );
};

export default ShareModal;
