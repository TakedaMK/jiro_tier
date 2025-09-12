import { useMemo } from 'react';
import { TenpoData, RankData } from '../types';

/**
 * 表示順序の計算と管理を行うカスタムフック
 */
export const useDisplayOrder = (
  tenpoData: TenpoData[],
  rankData: RankData[],
  selectedTier: string,
  currentTier: string,
  currentDisplayOrder: number
) => {
  // 選択されたTierの店舗数を計算
  const selectedTierTenpoCount = useMemo(() => {
    const selectedRank = rankData.find(rank => rank.rank_name === selectedTier);
    if (!selectedRank) return 0;

    return tenpoData.filter(tenpo =>
      tenpo.rank_CD === selectedRank.rank_CD && tenpo.haishi_flag === 0
    ).length;
  }, [tenpoData, rankData, selectedTier]);

  // 表示順序の選択肢を生成
  const displayOrderOptions = useMemo(() => {
    const options: number[] = [];

    // 同Tier内での変更の場合
    if (selectedTier === currentTier) {
      // 現在のTier内の要素数分の選択肢を表示
      for (let i = 1; i <= selectedTierTenpoCount; i++) {
        options.push(i);
      }
    } else {
      // 別Tierに移動する場合：要素数+1の選択肢を表示
      for (let i = 1; i <= selectedTierTenpoCount + 1; i++) {
        options.push(i);
      }
    }

    return options;
  }, [selectedTierTenpoCount, selectedTier, currentTier]);

  return {
    selectedTierTenpoCount,
    displayOrderOptions
  };
};