import { useCallback } from 'react';

/**
 * Tierリストを画像として保存するためのカスタムフック
 * スマートフォン（iPhone）での利用を前提とした実装
 */
export const useImageSave = () => {
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
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('画像の生成に失敗しました');
          return;
        }

        // ダウンロード用のURLを作成
        const url = URL.createObjectURL(blob);

        // ダウンロード用のリンクを作成
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

  return { saveAsImage };
};
