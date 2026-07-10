import { addSingleTenpoData } from './seedData';

/**
 * 単一の店舗データ追加スクリプトの実行
 * このファイルを直接実行してFirestoreに1つの店舗データを追加します
 */
const addSingleTenpo = async () => {
  try {
    console.log('Firestore店舗データ追加スクリプトを開始します...');

    // 追加する店舗データ（ここを編集して使用）
    const tenpoData = {
      tenpo_CD: 46,
      tenpo_name: "沖縄",
      rank_CD: 8,
      haishi_flag: 0,
      display_order: 100
    };

    // 店舗データを追加
    await addSingleTenpoData(tenpoData);

    console.log('店舗データ追加スクリプトが正常に完了しました！');
    process.exit(0);
  } catch (error) {
    console.error('店舗データ追加スクリプトでエラーが発生しました:', error);
    process.exit(1);
  }
};

// スクリプト実行
addSingleTenpo();

