import { seedTenpoData, verifyTenpoData } from './seedData';

/**
 * 店舗データ投入スクリプトの実行
 * このファイルを直接実行してFirestoreに店舗データを投入します
 */
const runSeedTenpoData = async () => {
  try {
    console.log('Firestore店舗データ投入スクリプトを開始します...');

    // 店舗データを投入
    await seedTenpoData();

    // 投入されたデータを確認
    await verifyTenpoData();

    console.log('店舗データ投入スクリプトが正常に完了しました！');
    process.exit(0);
  } catch (error) {
    console.error('店舗データ投入スクリプトでエラーが発生しました:', error);
    process.exit(1);
  }
};

// スクリプト実行
runSeedTenpoData();
