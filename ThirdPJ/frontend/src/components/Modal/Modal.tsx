
import React from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'medium' }) => {
  if (!isOpen) return null;

  const sizeClassName = `modal-content-${size}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${sizeClassName}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
