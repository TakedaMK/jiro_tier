import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  FirestoreTenpoData,
  FirestoreRankData,
  TenpoData,
  RankData,
  FIRESTORE_COLLECTIONS
} from '../types';
import { dummyTenpoData, rankMaster } from '../data/dummyData';

/**
 * Firestoreから店舗データを取得する
 * @returns Promise<TenpoData[]> 店舗データの配列
 */
export const getTenpoData = async (): Promise<TenpoData[]> => {
  try {
    const tenposRef = collection(db, FIRESTORE_COLLECTIONS.TENPOS);

    // インデックス作成後は以下の複合クエリを使用（コメントアウトを解除）
    // const q = query(
    //   tenposRef,
    //   where('haishi_flag', '==', 0), // 廃止フラグが0（有効）の店舗のみ
    //   orderBy('display_order', 'asc')
    // );

    // 一時的にインデックスエラーを回避するため、単純なクエリに変更
    const q = query(tenposRef);

    const querySnapshot = await getDocs(q);
    const tenpos: TenpoData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreTenpoData;
      tenpos.push({
        tenpo_CD: data.tenpo_CD,
        tenpo_name: data.tenpo_name,
        rank_CD: data.rank_CD,
        haishi_flag: data.haishi_flag,
        display_order: data.display_order
      });
    });

    // クライアント側でフィルタリングとソートを実行
    return tenpos
      .filter(tenpo => tenpo.haishi_flag === 0) // 廃止フラグが0（有効）の店舗のみ
      .sort((a, b) => a.display_order - b.display_order); // display_orderでソート

  } catch (error) {
    console.error('店舗データの取得に失敗しました:', error);
    console.log('ダミーデータを使用します');
    // Firestoreから取得できない場合はダミーデータを使用
    return dummyTenpoData.filter(tenpo => tenpo.haishi_flag === 0);
  }
};

/**
 * Firestoreからランクデータを取得する
 * @returns Promise<RankData[]> ランクデータの配列
 */
export const getRankData = async (): Promise<RankData[]> => {
  try {
    const ranksRef = collection(db, FIRESTORE_COLLECTIONS.RANKS);

    // 一時的にインデックスエラーを回避するため、単純なクエリに変更
    const q = query(ranksRef);

    const querySnapshot = await getDocs(q);
    const ranks: RankData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreRankData;
      ranks.push({
        rank_CD: data.rank_CD,
        rank_name: data.rank_name
      });
    });

    // クライアント側でソートを実行
    return ranks.sort((a, b) => a.rank_CD - b.rank_CD);

  } catch (error) {
    console.error('ランクデータの取得に失敗しました:', error);
    console.log('ダミーデータを使用します');
    // Firestoreから取得できない場合はダミーデータを使用
    return rankMaster;
  }
};

/**
 * 店舗データとランクデータを組み合わせてTierList用のデータを取得する
 * @returns Promise<{tenpos: TenpoData[], ranks: RankData[]}>
 */
export const getTierListData = async (): Promise<{
  tenpos: TenpoData[];
  ranks: RankData[];
}> => {
  try {
    const [tenpos, ranks] = await Promise.all([
      getTenpoData(),
      getRankData()
    ]);

    return { tenpos, ranks };
  } catch (error) {
    console.error('TierListデータの取得に失敗しました:', error);
    console.log('ダミーデータを使用します');
    // Firestoreから取得できない場合はダミーデータを使用
    return {
      tenpos: dummyTenpoData.filter(tenpo => tenpo.haishi_flag === 0),
      ranks: rankMaster
    };
  }
};