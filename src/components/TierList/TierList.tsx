import React from 'react';
import TierSection from './TierSection';
import { TierListProps } from '../../types';
import { rankMaster, dummyTenpoData, getTenposByRank } from '../../data/dummyData';
// @ts-ignore
import styles from './TierList.module.css';

/**
 * TierListコンポーネント
 * SSSからCまでの全Tierを表示するメインコンポーネント
 */
const TierList: React.FC<TierListProps> = ({
  onTenpoClick = () => {} // デフォルトは空の関数
}) => {
  // 店舗クリック時のハンドラー
  const handleTenpoClick = (tenpo_CD: number) => {
    console.log(`店舗クリック: ${tenpo_CD}`);
    onTenpoClick(tenpo_CD);
  };

  return (
    <div className={styles.tierListContainer}>
      <h1 className={styles.title}>ラーメン二郎 Tier List</h1>

      <div className={styles.tierList}>
        {rankMaster.map((rank) => {
          const tenpos = getTenposByRank(dummyTenpoData, rank.rank_CD);

          return (
            <TierSection
              key={rank.rank_CD}
              rankData={rank}
              tenpos={tenpos}
              onTenpoClick={handleTenpoClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TierList;
