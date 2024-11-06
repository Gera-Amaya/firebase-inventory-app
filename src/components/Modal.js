import React from 'react';
import '../styles/Modal.css';

const Modal = ({ show, handleClose, children }) => {
  return (
    <>
      {show && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleClose}>
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
