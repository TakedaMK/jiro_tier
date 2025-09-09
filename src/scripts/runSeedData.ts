import { seedAllTestData, verifyTestData } from './seedTestData';

/**
 * テストデータ投入スクリプトの実行
 * このファイルを直接実行してFirestoreにテストデータを投入します
 */
const runSeedData = async () => {
  try {
    console.log('Firestoreテストデータ投入スクリプトを開始します...');

    // テストデータを投入
    await seedAllTestData();

    // 投入されたデータを確認
    await verifyTestData();

    console.log('テストデータ投入スクリプトが正常に完了しました！');
    process.exit(0);
  } catch (error) {
    console.error('テストデータ投入スクリプトでエラーが発生しました:', error);
    process.exit(1);
  }
};

// スクリプト実行
runSeedData();
