/**
 * 店舗データの型定義
 * DBの店舗テーブルに対応
 */
export interface TenpoData {
  tenpo_CD: number;        // 店舗コード (PK)
  tenpo_name: string;      // 店舗名
  rank_CD: number;         // ランクコード (FK)
  haishi_flag: number;     // 廃止フラグ (0:有効, 1:廃止)
}

/**
 * ランクデータの型定義
 * DBのランクテーブルに対応
 */
export interface RankData {
  rank_CD: number;         // ランクコード (PK)
  rank_name: string;       // ランク名 ("SSS", "SS", "S", "A+", "A", "A-", "B", "C")
}

/**
 * TierSectionコンポーネントのProps型定義
 */
export interface TierSectionProps {
  rankData: RankData;      // ランク情報
  tenpos: TenpoData[];     // そのランクに属する店舗の配列（廃止フラグ=0のみ）
  onTenpoClick: (tenpo_CD: number) => void; // 店舗クリック時のコールバック
}

/**
 * TierListコンポーネントのProps型定義
 */
export interface TierListProps {
  onTenpoClick?: (tenpo_CD: number) => void; // 店舗クリック時のコールバック（オプション）
}

/**
 * TierEditDialogコンポーネントのProps型定義
 */
export interface TierEditDialogProps {
  isOpen: boolean;                    // ダイアログの表示状態
  tenpoName: string;                  // 店舗名
  currentTier: string;                // 現在のTier
  onClose: () => void;                // ダイアログを閉じる時のコールバック
  onSave: (newTier: string) => void;  // Tierを保存する時のコールバック
}

/**
 * Firestore用の店舗データ型定義
 */
export interface FirestoreTenpoData {
  id: string;                         // FirestoreのドキュメントID
  tenpo_CD: number;                   // 店舗コード
  tenpo_name: string;                 // 店舗名
  rank_CD: number;                    // ランクコード
  haishi_flag: number;                // 廃止フラグ (0:有効, 1:廃止)
  createdAt: Date;                    // 作成日時
  updatedAt: Date;                    // 更新日時
}

/**
 * Firestore用のランクデータ型定義
 */
export interface FirestoreRankData {
  id: string;                         // FirestoreのドキュメントID
  rank_CD: number;                    // ランクコード
  rank_name: string;                  // ランク名
  display_order: number;              // 表示順序
  createdAt: Date;                    // 作成日時
  updatedAt: Date;                    // 更新日時
}

/**
 * Firestoreコレクション名の定数
 */
export const FIRESTORE_COLLECTIONS = {
  TENPOS: 'tenpos',                   // 店舗コレクション
  RANKS: 'ranks'                      // ランクコレクション
} as const;