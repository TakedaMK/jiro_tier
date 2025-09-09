import React from 'react';
import Tenpo from '../atoms/Tenpo/Tenpo';
import { TierSectionProps } from '../../types';
// @ts-ignore
import styles from './TierSection.module.css';

/**
 * TierSectionコンポーネント
 * 単一のTier（SSS, SS, S, A+, A, A-, B, C）を表示するコンポーネント
 */
const TierSection: React.FC<TierSectionProps> = ({
  rankData,
  tenpos,
  onTenpoClick
}) => {
  // Tierの色クラスを取得
  const getTierColorClass = (rank_name: string): string => {
    switch (rank_name) {
      case 'SSS': return styles.tierSSS;
      case 'SS': return styles.tierSS;
      case 'S': return styles.tierS;
      case 'A+': return styles.tierAPlus;
      case 'A': return styles.tierA;
      case 'A-': return styles.tierAMinus;
      case 'B': return styles.tierB;
      case 'C': return styles.tierC;
      default: return styles.tierDefault;
    }
  };

  const tierColorClass = getTierColorClass(rankData.rank_name);

  return (
    <div className={`${styles.tierSection} ${tierColorClass}`}>
      {/* Tierラベル */}
      <div className={styles.tierLabel}>
        {rankData.rank_name}
      </div>

      {/* 店舗エリア */}
      <div className={styles.tenpoArea}>
        {tenpos.length > 0 ? (
          tenpos.map((tenpo) => (
            <Tenpo
              key={tenpo.tenpo_CD}
              name={tenpo.tenpo_name}
              onClick={() => onTenpoClick(tenpo.tenpo_CD)}
            />
          ))
        ) : (
          <div className={styles.emptyMessage}>
            {/* 空の場合は何も表示しない */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TierSection;
