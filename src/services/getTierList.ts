// Firebase Firestore（NoSQLデータベース）からデータを取得するための関数をインポート
import {
  collection,  // コレクション（テーブルのようなもの）を参照する関数
  getDocs,     // コレクション内の全ドキュメントを取得する関数
  query,       // データベースクエリ（検索条件）を作成する関数
  where,       // 特定の条件でフィルタリングする関数
  orderBy,     // データを並び替える関数
  doc,         // 特定のドキュメントを参照する関数
  getDoc       // 特定のドキュメントを取得する関数
} from 'firebase/firestore';

// Firebaseの設定ファイルからデータベース接続オブジェクトをインポート
import { db } from '../lib/firebase';

// 型定義をインポート（TypeScriptでデータの構造を定義）
import {
  FirestoreTenpoData,  // Firestoreから取得する店舗データの型
  FirestoreRankData,   // Firestoreから取得するランクデータの型
  TenpoData,           // アプリ内で使用する店舗データの型
  RankData,            // アプリ内で使用するランクデータの型
  FIRESTORE_COLLECTIONS // Firestoreのコレクション名定数
} from '../types';

// エラー時のフォールバック用ダミーデータをインポート
import { dummyTenpoData, rankMaster } from '../data/dummyData';

/**
 * Firestoreから店舗データを取得する関数
 * 
 * 【処理の流れ】
 * 1. Firestoreの「店舗」コレクションにアクセス
 * 2. 全店舗データを取得
 * 3. 有効な店舗のみをフィルタリング（廃止フラグ=0）
 * 4. 表示順でソート
 * 5. エラー時はダミーデータを返す
 * 
 * @returns Promise<TenpoData[]> 店舗データの配列
 */
export const getTenpoData = async (): Promise<TenpoData[]> => {
  try {
    // Firestoreの「店舗」コレクションへの参照を取得
    // collection()は、データベースの特定のテーブル（コレクション）を指定する関数
    const tenposRef = collection(db, FIRESTORE_COLLECTIONS.TENPOS);

    // 【理想的なクエリ】インデックス作成後は以下の複合クエリを使用（現在はコメントアウト）
    // このクエリは、データベース側でフィルタリングとソートを行うため効率的
    // const q = query(
    //   tenposRef,
    //   where('haishi_flag', '==', 0), // 廃止フラグが0（有効）の店舗のみをフィルタ
    //   orderBy('display_order', 'asc') // display_orderの昇順でソート
    // );

    // 【現在のクエリ】一時的にインデックスエラーを回避するため、単純なクエリに変更
    // 全データを取得してから、クライアント側でフィルタリングとソートを実行
    const q = query(tenposRef);

    // クエリを実行してデータを取得
    // getDocs()は非同期処理なので、awaitで結果を待つ
    const querySnapshot = await getDocs(q);
    
    // 取得したデータを格納する配列を初期化
    const tenpos: TenpoData[] = [];

    // 取得した各ドキュメント（店舗データ）を処理
    querySnapshot.forEach((doc) => {
      // doc.data()でドキュメントの内容を取得し、型を指定
      const data = doc.data() as FirestoreTenpoData;
      
      // Firestoreのデータ形式をアプリで使用する形式に変換して配列に追加
      tenpos.push({
        tenpo_CD: data.tenpo_CD,           // 店舗コード
        tenpo_name: data.tenpo_name,       // 店舗名
        rank_CD: data.rank_CD,             // ランクコード
        haishi_flag: data.haishi_flag,     // 廃止フラグ（0=有効、1=廃止）
        display_order: data.display_order  // 表示順序
      });
    });

    // クライアント側でフィルタリングとソートを実行
    // 本来はデータベース側で行う方が効率的だが、インデックス未作成のためクライアント側で実行
    return tenpos
      .filter(tenpo => tenpo.haishi_flag === 0) // 廃止フラグが0（有効）の店舗のみを抽出
      .sort((a, b) => a.display_order - b.display_order); // display_orderの昇順でソート

  } catch (error) {
    // エラーが発生した場合の処理
    console.error('店舗データの取得に失敗しました:', error);
    console.log('ダミーデータを使用します');
    
    // Firestoreから取得できない場合は、事前に用意したダミーデータを使用
    // これにより、データベースに問題があってもアプリは動作し続ける
    return dummyTenpoData.filter(tenpo => tenpo.haishi_flag === 0);
  }
};

/**
 * Firestoreからランクデータを取得する関数
 * 
 * 【処理の流れ】
 * 1. Firestoreの「ランク」コレクションにアクセス
 * 2. 全ランクデータを取得
 * 3. ランクコード順でソート
 * 4. エラー時はダミーデータを返す
 * 
 * @returns Promise<RankData[]> ランクデータの配列
 */
export const getRankData = async (): Promise<RankData[]> => {
  try {
    // Firestoreの「ランク」コレクションへの参照を取得
    // ランクデータには SSS、SS、S、A+、A、A-、B、C などの情報が含まれる
    const ranksRef = collection(db, FIRESTORE_COLLECTIONS.RANKS);

    // 【現在のクエリ】一時的にインデックスエラーを回避するため、単純なクエリに変更
    // 全ランクデータを取得してから、クライアント側でソートを実行
    const q = query(ranksRef);

    // クエリを実行してデータを取得
    const querySnapshot = await getDocs(q);
    
    // 取得したデータを格納する配列を初期化
    const ranks: RankData[] = [];

    // 取得した各ドキュメント（ランクデータ）を処理
    querySnapshot.forEach((doc) => {
      // doc.data()でドキュメントの内容を取得し、型を指定
      const data = doc.data() as FirestoreRankData;
      
      // Firestoreのデータ形式をアプリで使用する形式に変換して配列に追加
      ranks.push({
        rank_CD: data.rank_CD,     // ランクコード（数値：1=SSS、2=SS、3=S...）
        rank_name: data.rank_name  // ランク名（文字列：SSS、SS、S...）
      });
    });

    // クライアント側でソートを実行
    // ランクコードの昇順でソート（SSS→SS→S→A+→A→A-→B→Cの順）
    return ranks.sort((a, b) => a.rank_CD - b.rank_CD);

  } catch (error) {
    // エラーが発生した場合の処理
    console.error('ランクデータの取得に失敗しました:', error);
    console.log('ダミーデータを使用します');
    
    // Firestoreから取得できない場合は、事前に用意したダミーデータを使用
    // これにより、データベースに問題があってもアプリは動作し続ける
    return rankMaster;
  }
};

/**
 * 店舗データとランクデータを組み合わせてTierList用のデータを取得する関数
 * 
 * 【処理の流れ】
 * 1. 店舗データとランクデータを並行して取得（Promise.all使用）
 * 2. 両方のデータを組み合わせて返す
 * 3. エラー時はダミーデータを返す
 * 
 * 【Promise.allについて】
 * - 複数の非同期処理を並行実行する
 * - 全ての処理が完了するまで待つ
 * - 一つでもエラーが発生したら全体がエラーになる
 * - 順次実行より高速（店舗データとランクデータの取得を同時に行う）
 * 
 * @returns Promise<{tenpos: TenpoData[], ranks: RankData[]}>
 */
export const getTierListData = async (): Promise<{
  tenpos: TenpoData[];  // 店舗データの配列
  ranks: RankData[];    // ランクデータの配列
}> => {
  try {
    // Promise.allを使用して店舗データとランクデータを並行取得
    // これにより、データ取得時間を短縮できる
    const [tenpos, ranks] = await Promise.all([
      getTenpoData(),  // 店舗データを取得
      getRankData()    // ランクデータを取得
    ]);

    // 取得した両方のデータをオブジェクト形式で返す
    return { tenpos, ranks };
    
  } catch (error) {
    // エラーが発生した場合の処理
    console.error('TierListデータの取得に失敗しました:', error);
    console.log('ダミーデータを使用します');
    
    // Firestoreから取得できない場合は、事前に用意したダミーデータを使用
    // これにより、データベースに問題があってもアプリは動作し続ける
    return {
      tenpos: dummyTenpoData.filter(tenpo => tenpo.haishi_flag === 0), // 有効な店舗のみのダミーデータ
      ranks: rankMaster  // ランクのダミーデータ
    };
  }
};