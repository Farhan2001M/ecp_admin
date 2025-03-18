// components/ProductStatusToggleModal.tsx
import { Dialog } from "@headlessui/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <Dialog.Title className="text-lg font-semibold mb-2">Confirm Action</Dialog.Title>
          <p className="mb-4">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationModal;