// import React from "react";
import './AlertDialog.css';

const ConfirmationModal = ({ show, onHide, onConfirm, title, cancelText, confirmText, cancelVariant, confirmVariant, message }) => {
  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <span className="close" onClick={onHide}>&times;</span>
          </div>
          <div className="modal-body">{message}</div>
          <div className="modal-footer">
            <button className={`btn ${cancelVariant} cancel`} onClick={onHide}>{cancelText}</button>
            <button className={`btn ${confirmVariant} confirm`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
