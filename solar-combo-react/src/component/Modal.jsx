import React from 'react';
import "../modal.css"
const Modal = ({ show, onClose, children }) => {
    return (
        <div className={`modal-backdrop ${show ? 'show' : ''}`}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
