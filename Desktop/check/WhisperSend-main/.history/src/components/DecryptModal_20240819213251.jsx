import React from "react";

function DecryptModal({ onClose, onDecrypt }) {
    const handleDecrypt = () => {
        onDecrypt(true);
        onClose();
    };

    const handleClose = () => {
        onDecrypt(false);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Do you want to decrypt the received file?</h2>
                <button onClick={handleDecrypt}>Yes</button>
                <button onClick={handleClose}>No</button>
            </div>
        </div>
    );
}

export default DecryptModal;
