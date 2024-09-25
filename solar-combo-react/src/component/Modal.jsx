import React from 'react';
import "../modal.css"



const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>X</button>
                <p>It appears that some fields are incomplete. Please check your input values.</p>
            </div>
        </div>
    );
};

export default Modal;
