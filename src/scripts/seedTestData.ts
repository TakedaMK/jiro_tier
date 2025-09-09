import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FIRESTORE_COLLECTIONS } from '../types';

/**
 * テストデータ投入用スクリプト
 * Firestoreにランクデータと店舗データを投入します
 */

// ランクデータの定義
const rankData = [
  { rank_CD: 1, rank_name: 'SSS', display_order: 1 },
  { rank_CD: 2, rank_name: 'SS', display_order: 2 },
  { rank_CD: 3, rank_name: 'S', display_order: 3 },
  { rank_CD: 4, rank_name: 'A+', display_order: 4 },
  { rank_CD: 5, rank_name: 'A', display_order: 5 },
  { rank_CD: 6, rank_name: 'A-', display_order: 6 },
  { rank_CD: 7, rank_name: 'B', display_order: 7 },
  { rank_CD: 8, rank_name: 'C', display_order: 8 }
];

// テスト店舗データ
const testTenpoData = {
  tenpo_CD: 44,
  tenpo_name: '朝倉街道',
  rank_CD: 2, // SSランク
  haishi_flag: 0
};

/**
 * ランクデータをFirestoreに投入する
 */
export const seedRankData = async (): Promise<void> => {
  try {
    console.log('ランクデータの投入を開始します...');

    for (const rank of rankData) {
      // 既存データの確認
      const ranksRef = collection(db, FIRESTORE_COLLECTIONS.RANKS);
      const q = query(ranksRef, where('rank_CD', '==', rank.rank_CD));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // データが存在しない場合は追加
        const docData = {
          ...rank,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await addDoc(ranksRef, docData);
        console.log(`ランクデータを追加しました: ${rank.rank_name} (rank_CD: ${rank.rank_CD})`);
      } else {
        console.log(`ランクデータは既に存在します: ${rank.rank_name} (rank_CD: ${rank.rank_CD})`);
      }
    }

    console.log('ランクデータの投入が完了しました');
  } catch (error) {
    console.error('ランクデータの投入に失敗しました:', error);
    throw error;
  }
};

/**
 * 店舗データをFirestoreに投入する
 */
export const seedTenpoData = async (): Promise<void> => {
  try {
    console.log('店舗データの投入を開始します...');

    const tenposRef = collection(db, FIRESTORE_COLLECTIONS.TENPOS);

    // 既存データの確認
    const q = query(tenposRef, where('tenpo_CD', '==', testTenpoData.tenpo_CD));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // データが存在しない場合は追加
      const docData = {
        ...testTenpoData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(tenposRef, docData);
      console.log(`店舗データを追加しました: ${testTenpoData.tenpo_name} (tenpo_CD: ${testTenpoData.tenpo_CD})`);
    } else {
      console.log(`店舗データは既に存在します: ${testTenpoData.tenpo_name} (tenpo_CD: ${testTenpoData.tenpo_CD})`);
    }

    console.log('店舗データの投入が完了しました');
  } catch (error) {
    console.error('店舗データの投入に失敗しました:', error);
    throw error;
  }
};

/**
 * 全てのテストデータを投入する
 */
export const seedAllTestData = async (): Promise<void> => {
  try {
    console.log('=== テストデータ投入開始 ===');

    // ランクデータを投入
    await seedRankData();

    // 店舗データを投入
    await seedTenpoData();

    console.log('=== テストデータ投入完了 ===');
  } catch (error) {
    console.error('テストデータの投入に失敗しました:', error);
    throw error;
  }
};

/**
 * 投入されたデータを確認する
 */
export const verifyTestData = async (): Promise<void> => {
  try {
    console.log('=== データ確認開始 ===');

    // ランクデータの確認
    const ranksRef = collection(db, FIRESTORE_COLLECTIONS.RANKS);
    const ranksSnapshot = await getDocs(ranksRef);
    console.log(`ランクデータ数: ${ranksSnapshot.size}`);
    ranksSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${data.rank_name} (rank_CD: ${data.rank_CD})`);
    });

    // 店舗データの確認
    const tenposRef = collection(db, FIRESTORE_COLLECTIONS.TENPOS);
    const tenposSnapshot = await getDocs(tenposRef);
    console.log(`店舗データ数: ${tenposSnapshot.size}`);
    tenposSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${data.tenpo_name} (tenpo_CD: ${data.tenpo_CD}, rank_CD: ${data.rank_CD})`);
    });

    console.log('=== データ確認完了 ===');
  } catch (error) {
    console.error('データ確認に失敗しました:', error);
    throw error;
  }
};
