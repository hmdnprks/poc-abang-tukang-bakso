import { FC } from 'react';
import Image from 'next/image';

interface ConfirmationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationDrawer: FC<ConfirmationDrawerProps> = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed inset-x-0 ${isOpen ? 'bottom-0 md:top-1/4 md:bottom-auto' : '-bottom-full'}
                    transition-transform duration-300 transform bg-white rounded-t-3xl md:rounded-2xl z-50
                    md:max-w-md md:w-1/3 md:mx-auto md:shadow-lg p-6 flex flex-col items-center`}
        style={{ maxWidth: '100%', transition: 'transform 0.3s ease-in-out' }}
      >

        <div className="w-12 h-1 bg-gray-300 rounded-full mb-4 md:hidden" />

        <div className="flex flex-col items-center">
          <Image src="/images/confirmation.png" alt="Warning" className="mb-4" width={100} height={100} />
          <p className="text-center text-gray-700 mb-6">{message}</p>

          <button
            onClick={onConfirm}
            className="w-full bg-red-500 text-white py-2 rounded-full font-semibold mb-3 hover:bg-red-600 transition"
          >
            OK
          </button>
          <button
            onClick={onClose}
            className="w-full border border-red-500 text-red-500 py-2 rounded-full font-semibold hover:bg-red-50 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationDrawer;
