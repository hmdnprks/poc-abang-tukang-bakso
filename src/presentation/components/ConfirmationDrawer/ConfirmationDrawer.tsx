import { FC, ReactNode } from 'react';
import Image from 'next/image';
import { ConfirmationAction } from '@core/entities/ConfirmationAction';

interface ConfirmationDrawerProps extends ConfirmationAction {
  isOpen: boolean;
  children: ReactNode;
}

const ConfirmationDrawer: FC<ConfirmationDrawerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  children
}) => {
  return (
    <>
      {isOpen && (
        <button aria-label="Overlay" className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}

      {isOpen && (<div
        className={`fixed inset-x-0 bottom-0 md:top-1/4 md:bottom-auto
                    transition-transform duration-300 transform bg-white rounded-t-3xl
                    md:rounded-2xl z-[2000]
                    md:max-w-md md:w-1/3 md:mx-auto md:shadow-lg p-6 flex flex-col items-center`}
        data-testid="confirmation-drawer"
        style={{ maxWidth: '100%', transition: 'transform 0.3s ease-in-out' }}
      >

        <div className="w-12 h-1 bg-gray-300 rounded-full mb-4 md:hidden" />

        <div className="flex flex-col items-center">
          <Image alt="Warning" className="mb-4" height={100} src="/images/confirmation.png" width={100} />
          <div className="text-center text-gray-700 mb-6">{children}</div>

          <button
            className="w-full bg-red-500 text-white py-2 rounded-full font-semibold mb-3 hover:bg-red-600 transition"
            onClick={onConfirm}
          >
            OK
          </button>
          <button
            className="w-full border border-red-500 text-red-500 py-2 rounded-full font-semibold hover:bg-red-50 transition"
            onClick={onClose}
          >
            Batal
          </button>
        </div>
      </div>)}
    </>
  );
};

export default ConfirmationDrawer;
