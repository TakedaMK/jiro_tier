import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  writeBatch
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

/**
 * 店舗のTierと表示順序を更新する
 * @param tenpo_CD 店舗コード
 * @param newRank_CD 新しいランクコード
 * @param newDisplayOrder 新しい表示順序
 * @returns Promise<void>
 */
export const updateTenpoTierAndDisplayOrder = async (
  tenpo_CD: number,
  newRank_CD: number,
  newDisplayOrder: number
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    // 1. 対象店舗を取得
    const tenposRef = collection(db, FIRESTORE_COLLECTIONS.TENPOS);
    const targetQuery = query(tenposRef, where('tenpo_CD', '==', tenpo_CD));
    const targetSnapshot = await getDocs(targetQuery);

    if (targetSnapshot.empty) {
      throw new Error(`店舗コード ${tenpo_CD} の店舗が見つかりません`);
    }

    const targetDoc = targetSnapshot.docs[0];
    const targetData = targetDoc.data();
    const currentRank_CD = targetData.rank_CD;
    const currentDisplayOrder = targetData.display_order;

    // 2. 新しいランク内の店舗を取得（display_orderでソート）
    const newRankQuery = query(
      tenposRef,
      where('rank_CD', '==', newRank_CD),
      where('haishi_flag', '==', 0)
    );
    const newRankSnapshot = await getDocs(newRankQuery);

    // 3. 同じランク内での順序変更の場合
    if (currentRank_CD === newRank_CD) {
      // 前方移動（display_orderを小さくする）の場合
      if (currentDisplayOrder > newDisplayOrder) {
        // newDisplayOrder以上、currentDisplayOrder未満の店舗のdisplay_orderを+1する
        const affectedTenpos = newRankSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.display_order >= newDisplayOrder &&
                 data.display_order < currentDisplayOrder &&
                 data.tenpo_CD !== tenpo_CD;
        });

        // 対象店舗のdisplay_orderを更新
        batch.update(doc(db, FIRESTORE_COLLECTIONS.TENPOS, targetDoc.id), {
          display_order: newDisplayOrder,
          updatedAt: serverTimestamp()
        });

        // 影響を受ける店舗のdisplay_orderを+1
        affectedTenpos.forEach(affectedDoc => {
          const affectedData = affectedDoc.data();
          batch.update(doc(db, FIRESTORE_COLLECTIONS.TENPOS, affectedDoc.id), {
            display_order: affectedData.display_order + 1,
            updatedAt: serverTimestamp()
          });
        });
      } else {
        // 後方移動（display_orderを大きくする）の場合
        // currentDisplayOrderより大きく、newDisplayOrder以下の店舗のdisplay_orderを-1する
        const affectedTenpos = newRankSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.display_order > currentDisplayOrder &&
                 data.display_order <= newDisplayOrder &&
                 data.tenpo_CD !== tenpo_CD;
        });

        // 対象店舗のdisplay_orderを更新
        batch.update(doc(db, FIRESTORE_COLLECTIONS.TENPOS, targetDoc.id), {
          display_order: newDisplayOrder,
          updatedAt: serverTimestamp()
        });

        // 影響を受ける店舗のdisplay_orderを-1
        affectedTenpos.forEach(affectedDoc => {
          const affectedData = affectedDoc.data();
          batch.update(doc(db, FIRESTORE_COLLECTIONS.TENPOS, affectedDoc.id), {
            display_order: affectedData.display_order - 1,
            updatedAt: serverTimestamp()
          });
        });
      }
    } else {
      // 4. 別ランクへの移動の場合
      // 元のランク内の店舗のdisplay_orderを調整
      const oldRankQuery = query(
        tenposRef,
        where('rank_CD', '==', currentRank_CD),
        where('haishi_flag', '==', 0)
      );
      const oldRankSnapshot = await getDocs(oldRankQuery);

      const oldRankAffectedTenpos = oldRankSnapshot.docs.filter(doc => {
        const data = doc.data();
        return data.display_order > currentDisplayOrder;
      });

      // 元のランク内の影響を受ける店舗のdisplay_orderを-1
      oldRankAffectedTenpos.forEach(affectedDoc => {
        const affectedData = affectedDoc.data();
        batch.update(doc(db, FIRESTORE_COLLECTIONS.TENPOS, affectedDoc.id), {
          display_order: affectedData.display_order - 1,
          updatedAt: serverTimestamp()
        });
      });

      // 新しいランク内の影響を受ける店舗のdisplay_orderを+1
      const newRankAffectedTenpos = newRankSnapshot.docs.filter(doc => {
        const data = doc.data();
        return data.display_order >= newDisplayOrder;
      });

      newRankAffectedTenpos.forEach(affectedDoc => {
        const affectedData = affectedDoc.data();
        batch.update(doc(db, FIRESTORE_COLLECTIONS.TENPOS, affectedDoc.id), {
          display_order: affectedData.display_order + 1,
          updatedAt: serverTimestamp()
        });
      });

      // 対象店舗のTierとdisplay_orderを更新
      batch.update(doc(db, FIRESTORE_COLLECTIONS.TENPOS, targetDoc.id), {
        rank_CD: newRank_CD,
        display_order: newDisplayOrder,
        updatedAt: serverTimestamp()
      });
    }

    // バッチ処理を実行
    await batch.commit();
    console.log(`店舗コード ${tenpo_CD} のTierと表示順序を更新しました`);
  } catch (error) {
    console.error('Tierと表示順序の更新に失敗しました:', error);
    throw new Error('Tierと表示順序の更新に失敗しました');
  }
};

/**
 * 店舗のTierと表示順序をランク名で更新する
 * @param tenpo_CD 店舗コード
 * @param newRankName 新しいランク名
 * @param newDisplayOrder 新しい表示順序
 * @returns Promise<void>
 */
export const updateTenpoTierAndDisplayOrderByName = async (
  tenpo_CD: number,
  newRankName: string,
  newDisplayOrder: number
): Promise<void> => {
  try {
    // ランク名からランクコードを取得
    const newRank_CD = await getRankCodeByName(newRankName);

    // 店舗のTierと表示順序を更新
    await updateTenpoTierAndDisplayOrder(tenpo_CD, newRank_CD, newDisplayOrder);
  } catch (error) {
    console.error('Tierと表示順序の更新に失敗しました:', error);
    throw new Error('Tierと表示順序の更新に失敗しました');
  }
};