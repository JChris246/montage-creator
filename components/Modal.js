import React, { useRef } from "react";

import styles from '../styles/Modal.module.css'

const Modal = ({ children, onClose, center }) => {
    const modal = useRef();

    const shouldClose = e => {
        if (e.target === modal.current && onClose)
            onClose();
    };

    return (
        <div className={styles.modal} style={center ? { alignItems: "center" } : {}} onClick={shouldClose} ref={modal}>
            { children }
        </div>
    );
};

export default Modal;