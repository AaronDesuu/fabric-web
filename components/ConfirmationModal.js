'use client';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Remove', cancelText = 'Cancel' }) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>{cancelText}</button>
                    <button className={styles.confirmBtn} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}
