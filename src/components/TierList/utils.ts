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
      // iPhoneでの表示を最適化するための設定
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#000000',
        scale: 2.0, // 画質向上のためスケールを2.0に上げる
        width: tierListRef.current.scrollWidth,
        height: tierListRef.current.scrollHeight,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        removeContainer: true,
        // iPhoneでの安全領域を考慮
        y: 0,
        x: 0,
        scrollX: 0,
        scrollY: 0,
        // 画質向上のための設定
        logging: false,
        ignoreElements: (element) => {
          // Safe Area関連の要素を除外
          return element.classList.contains('safe-area-inset');
        }
      });

      // 画像のサイズを調整（高画質を維持）
      const maxWidth = 1200; // 画質向上のため最大幅を増加
      const maxHeight = 1800; // 画質向上のため最大高さを増加

      let { width, height } = canvas;

      // アスペクト比を保ちながらサイズを調整
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // 新しいキャンバスを作成してサイズを調整
      const resizedCanvas = document.createElement('canvas');
      const resizedCtx = resizedCanvas.getContext('2d');

      resizedCanvas.width = width;
      resizedCanvas.height = height;

      if (resizedCtx) {
        // 高画質設定
        resizedCtx.imageSmoothingEnabled = true;
        resizedCtx.imageSmoothingQuality = 'high';

        resizedCtx.fillStyle = '#000000';
        resizedCtx.fillRect(0, 0, width, height);
        resizedCtx.drawImage(canvas, 0, 0, width, height);

        // iPhoneでのフォト保存
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          // iOSデバイスの場合、フォトに直接保存
          resizedCanvas.toBlob(async (blob) => {
            if (blob) {
              try {
                // Web Share APIを使用してフォトに保存
                if (navigator.share) {
                  const file = new File([blob], 'tierlist.png', { type: 'image/png' });
                  await navigator.share({
                    title: 'Tier List',
                    text: 'ラーメン二郎 Tier表',
                    files: [file]
                  });
                } else {
                  // フォールバック: ダウンロードリンク
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'tierlist.png';
                  link.click();
                  URL.revokeObjectURL(url);
                }
              } catch (error) {
                console.error('Share failed:', error);
                // フォールバック: ダウンロードリンク
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'tierlist.png';
                link.click();
                URL.revokeObjectURL(url);
              }
            }
          }, 'image/png', 1.0); // 最高品質で保存
        } else {
          // デスクトップの場合、通常のダウンロード
          const link = document.createElement('a');
          link.href = resizedCanvas.toDataURL('image/png', 1.0); // 最高品質で保存
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