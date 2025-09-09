import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FIRESTORE_COLLECTIONS } from '../types';

/**
 * 店舗のTierを更新する
 * @param tenpo_CD 店舗コード
 * @param newRank_CD 新しいランクコード
 * @returns Promise<void>
 */
export const updateTenpoTier = async (
  tenpo_CD: number,
  newRank_CD: number
): Promise<void> => {
  try {
    // 店舗コードで店舗を検索
    const tenposRef = collection(db, FIRESTORE_COLLECTIONS.TENPOS);
    const q = query(tenposRef, where('tenpo_CD', '==', tenpo_CD));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`店舗コード ${tenpo_CD} の店舗が見つかりません`);
    }

    // 最初のドキュメントを更新
    const docSnapshot = querySnapshot.docs[0];
    const docRef = doc(db, FIRESTORE_COLLECTIONS.TENPOS, docSnapshot.id);

    await updateDoc(docRef, {
      rank_CD: newRank_CD,
      updatedAt: serverTimestamp()
    });

    console.log(`店舗コード ${tenpo_CD} のTierを更新しました`);
  } catch (error) {
    console.error('Tierの更新に失敗しました:', error);
    throw new Error('Tierの更新に失敗しました');
  }
};

/**
 * ランク名からランクコードを取得する
 * @param rankName ランク名（"SSS", "SS", "S", "A+", "A", "A-", "B", "C"）
 * @returns Promise<number> ランクコード
 */
export const getRankCodeByName = async (rankName: string): Promise<number> => {
  try {
    const ranksRef = collection(db, FIRESTORE_COLLECTIONS.RANKS);
    const q = query(ranksRef, where('rank_name', '==', rankName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`ランク名 "${rankName}" が見つかりません`);
    }

    const rankData = querySnapshot.docs[0].data();
    return rankData.rank_CD;
  } catch (error) {
    console.error('ランクコードの取得に失敗しました:', error);
    throw new Error('ランクコードの取得に失敗しました');
  }
};

/**
 * 店舗のTierをランク名で更新する
 * @param tenpo_CD 店舗コード
 * @param newRankName 新しいランク名
 * @returns Promise<void>
 */
export const updateTenpoTierByName = async (
  tenpo_CD: number,
  newRankName: string
): Promise<void> => {
  try {
    // ランク名からランクコードを取得
    const newRank_CD = await getRankCodeByName(newRankName);

    // 店舗のTierを更新
    await updateTenpoTier(tenpo_CD, newRank_CD);
  } catch (error) {
    console.error('Tierの更新に失敗しました:', error);
    throw new Error('Tierの更新に失敗しました');
  }
};