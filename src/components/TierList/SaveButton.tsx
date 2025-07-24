import React from 'react';
import { saveImage } from './utils';

interface SaveButtonProps {
  tierListRef: React.RefObject<HTMLDivElement>;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ tierListRef }) => {
  const handleSaveImage = () => {
    saveImage(tierListRef);
  };

  return (
    <button
      onClick={handleSaveImage}
      style={{
        display: 'block',
        margin: '0 auto 16px auto',
        padding: '12px 32px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        background: '#ffe600',
        color: '#111',
        border: '2px solid #ffb800',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      画像として保存
    </button>
  );
};