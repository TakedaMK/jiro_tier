import { TenpoData, RankData } from '../types';

/**
 * ランクマスタデータ
 * 各Tierの基本情報を定義
 */
export const rankMaster: RankData[] = [
  { rank_CD: 1, rank_name: "SSS" },
  { rank_CD: 2, rank_name: "SS" },
  { rank_CD: 3, rank_name: "S" },
  { rank_CD: 4, rank_name: "A+" },
  { rank_CD: 5, rank_name: "A" },
  { rank_CD: 6, rank_name: "A-" },
  { rank_CD: 7, rank_name: "B" },
  { rank_CD: 8, rank_name: "C" }
];

/**
 * 店舗ダミーデータ
 * 各Tierに店舗を配置（画像の内容を参考）
 */
export const dummyTenpoData: TenpoData[] = [
  // SSS Tier
  { tenpo_CD: 1, tenpo_name: "横浜関内", rank_CD: 1, haishi_flag: 0 },

  // SS Tier - 空

  // S Tier
  { tenpo_CD: 2, tenpo_name: "野猿街道", rank_CD: 3, haishi_flag: 0 },
  { tenpo_CD: 3, tenpo_name: "湘南藤沢", rank_CD: 3, haishi_flag: 0 },

  // A+ Tier - 空

  // A Tier
  { tenpo_CD: 4, tenpo_name: "京急川崎", rank_CD: 5, haishi_flag: 0 },
  { tenpo_CD: 5, tenpo_name: "めじろ台", rank_CD: 5, haishi_flag: 0 },
  { tenpo_CD: 6, tenpo_name: "栃木街道", rank_CD: 5, haishi_flag: 0 },
  { tenpo_CD: 7, tenpo_name: "千住大橋", rank_CD: 5, haishi_flag: 0 },
  { tenpo_CD: 8, tenpo_name: "会津若松", rank_CD: 5, haishi_flag: 0 },
  { tenpo_CD: 9, tenpo_name: "大宮公園", rank_CD: 5, haishi_flag: 0 },

  // A- Tier - 空

  // B Tier - 空

  // C Tier - 空
];

/**
 * 有効な店舗のみを取得するヘルパー関数
 */
export const getActiveTenpos = (tenpos: TenpoData[]): TenpoData[] => {
  return tenpos.filter(tenpo => tenpo.haishi_flag === 0);
};

/**
 * 指定されたランクの店舗を取得するヘルパー関数
 */
export const getTenposByRank = (tenpos: TenpoData[], rank_CD: number): TenpoData[] => {
  return getActiveTenpos(tenpos).filter(tenpo => tenpo.rank_CD === rank_CD);
};
