// src/presentation/components/CloseButton.tsx
import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button
      className="absolute top-4 right-4 z-[1000] p-2 bg-white rounded-full shadow-xl hover:bg-gray-200 transition duration-200"
      data-testid="btn-close"
      onClick={onClick}
    >
      <svg
        className="h-6 w-6 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 18L18 6M6 6l12 12"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
};

export default CloseButton;
