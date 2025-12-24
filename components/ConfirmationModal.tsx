import React from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger'
}) => {
  const confirmButtonClass = variant === 'danger' 
    ? 'bg-red-600 hover:bg-red-700' 
    : 'bg-highlight hover:bg-blue-600';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="space-y-6">
        <p className="text-text-secondary leading-relaxed">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-accent"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-lg font-semibold transition-colors shadow-sm ${confirmButtonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;