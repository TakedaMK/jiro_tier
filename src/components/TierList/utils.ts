import React from 'react';
import html2canvas from 'html2canvas';
import { Restaurant } from './types';

// EXの特別な制限をチェックする関数
export const checkEXRestrictions = (draggedRestaurant: Restaurant, targetTier: string): boolean => {
  // EXには他のアイテムを入れられない
  if (targetTier === 'EX' && draggedRestaurant.name !== '三田') {
    return false;
  }

  // 三田はEXから離れられない
  if (draggedRestaurant.name === '三田' && targetTier !== 'EX') {
    return false;
  }

  return true;
};

// 画像保存処理
export const saveImage = async (tierListRef: React.RefObject<HTMLDivElement>) => {
  if (tierListRef.current) {
    try {
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        width: tierListRef.current.scrollWidth,
        height: tierListRef.current.scrollHeight,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        removeContainer: true,
        y: 0,
        x: 0,
        scrollX: 0,
        scrollY: 0
      });

      const ctx = canvas.getContext('2d');
      if (ctx) {
        const padding = 50;
        const newCanvas = document.createElement('canvas');
        const newCtx = newCanvas.getContext('2d');

        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height + padding;

        if (newCtx) {
          newCtx.fillStyle = '#ffffff';
          newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
          newCtx.drawImage(canvas, 0, padding);

          const link = document.createElement('a');
          link.href = newCanvas.toDataURL('image/png');
          link.download = 'tierlist.png';
          link.click();
        }
      }
    } catch (error) {
      console.error('画像保存エラー:', error);
      alert('画像の保存に失敗しました。もう一度お試しください。');
    }
  }
};