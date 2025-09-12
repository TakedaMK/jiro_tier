import { useCallback } from 'react';

/**
 * Tierリストを画像として保存するためのカスタムフック
 * スマートフォン（iPhone）での利用を前提とした実装
 * Web Share APIを使用してより直接的な共有機能を提供
 */
export const useImageSave = () => {
  /**
   * デバイスがWeb Share APIをサポートしているかチェック
   */
  const isWebShareSupported = useCallback(() => {
    return typeof navigator !== 'undefined' &&
           'share' in navigator &&
           'canShare' in navigator;
  }, []);

  /**
   * モバイルデバイスかどうかを判定
   */
  const isMobileDevice = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  /**
   * Web Share APIを使用して画像を共有する関数
   * @param blob - 共有する画像のBlob
   * @param filename - ファイル名
   */
  const shareImage = useCallback(async (blob: Blob, filename: string) => {
    if (!isWebShareSupported()) {
      return false;
    }

    try {
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'ラーメン二郎 Tier List',
          text: '私のラーメン二郎 Tier Listです！',
          files: [file]
        });
        return true;
      }
    } catch (error) {
      console.log('Web Share APIでの共有に失敗:', error);
    }

    return false;
  }, [isWebShareSupported]);

  /**
   * Tierリストを画像として保存する関数
   * @param elementId - 保存対象の要素のID
   * @param filename - 保存するファイル名（デフォルト: 'tier-list.png'）
   */
  const saveAsImage = useCallback(async (elementId: string, filename: string = 'tier-list.png') => {
    try {
      // html2canvasライブラリを動的にインポート
      const html2canvas = (await import('html2canvas')).default;

      // 保存対象の要素を取得
      const element = document.getElementById(elementId);
      if (!element) {
        console.error('保存対象の要素が見つかりません:', elementId);
        return;
      }

      // 要素をキャンバスに変換
      const canvas = await html2canvas(element, {
        backgroundColor: '#000000', // 背景色を黒に設定
        scale: 2, // 高解像度で保存
        useCORS: true, // クロスオリジン画像の読み込みを許可
        allowTaint: true, // 汚染されたキャンバスを許可
        scrollX: 0,
        scrollY: 0,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // キャンバスをBlobに変換
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('画像の生成に失敗しました');
          return;
        }

        // モバイルデバイスかつWeb Share APIが利用可能な場合、共有機能を使用
        if (isMobileDevice() && isWebShareSupported()) {
          const shared = await shareImage(blob, filename);
          if (shared) {
            console.log('Web Share APIで画像を共有しました:', filename);
            return;
          }
        }

        // フォールバック: 従来のダウンロード方式
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // リンクをクリックしてダウンロードを開始
        document.body.appendChild(link);
        link.click();

        // クリーンアップ
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('画像の保存が完了しました:', filename);
      }, 'image/png', 0.95);

    } catch (error) {
      console.error('画像保存中にエラーが発生しました:', error);

      // フォールバック: ブラウザの標準機能を使用
      try {
        const element = document.getElementById(elementId);
        if (!element) return;

        // 要素のスクリーンショットを取得（簡易版）
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 要素のサイズを取得
        const rect = element.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // 背景を黒で塗りつぶし
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 簡易的なテキスト描画（フォールバック）
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Tier List', canvas.width / 2, canvas.height / 2);

        // ダウンロード
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png');

      } catch (fallbackError) {
        console.error('フォールバック処理でもエラーが発生しました:', fallbackError);
        alert('画像の保存に失敗しました。html2canvasライブラリのインストールが必要です。');
      }
    }
  }, []);

  return {
    saveAsImage,
    isWebShareSupported: isWebShareSupported(),
    isMobileDevice: isMobileDevice()
  };
};
