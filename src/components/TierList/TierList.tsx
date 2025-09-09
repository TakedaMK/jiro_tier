import React, { useState } from 'react';
import TierSection from './TierSection';
import TierEditDialog from '../TierEditDialog/TierEditDialog';
import Button from '../atoms/Button/Button';
import { TierListProps, TenpoData, RankData } from '../../types';
import { rankMaster, dummyTenpoData, getTenposByRank } from '../../data/dummyData';
import { useImageSave } from '../../hooks/useImageSave';
// @ts-ignore
import styles from './TierList.module.css';

/**
 * TierListコンポーネント
 * SSSからCまでの全Tierを表示するメインコンポーネント
 */
const TierList: React.FC<TierListProps> = ({
  onTenpoClick = () => {} // デフォルトは空の関数
}) => {
  // ダイアログのstate管理
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTenpo, setSelectedTenpo] = useState<TenpoData | null>(null);
  const [selectedRank, setSelectedRank] = useState<RankData | null>(null);

  // 画像保存機能のフック
  const { saveAsImage } = useImageSave();

  // 店舗データから店舗名とTierを取得する関数
  const getTenpoInfo = (tenpo_CD: number) => {
    const tenpo = dummyTenpoData.find(t => t.tenpo_CD === tenpo_CD);
    const rank = rankMaster.find(r => r.rank_CD === tenpo?.rank_CD);
    return { tenpo, rank };
  };

  // 店舗クリック時のハンドラー
  const handleTenpoClick = (tenpo_CD: number) => {
    console.log(`店舗クリック: ${tenpo_CD}`);

    const { tenpo, rank } = getTenpoInfo(tenpo_CD);
    if (tenpo && rank) {
      setSelectedTenpo(tenpo);
      setSelectedRank(rank);
      setIsDialogOpen(true);
    }

    onTenpoClick(tenpo_CD);
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTenpo(null);
    setSelectedRank(null);
  };

  // Tierを保存する（現在はコンソールログのみ）
  const handleSaveTier = (newTier: string) => {
    if (selectedTenpo) {
      console.log(`店舗 ${selectedTenpo.tenpo_name} のTierを ${newTier} に変更`);
      // TODO: ここでDBに保存する処理を実装
    }
    handleCloseDialog();
  };

  // 画像として保存するハンドラー
  const handleSaveAsImage = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `tier-list-${timestamp}.png`;
    saveAsImage('tier-list-container', filename);
  };

  return (
    <div className={styles.tierListContainer}>
      <h1 className={styles.title}>ラーメン二郎 Tier List</h1>

      {/* 画像保存ボタン */}
      <div className={styles.saveButtonContainer}>
        <Button
          text="画像として保存"
          onClick={handleSaveAsImage}
          className={styles.saveButton}
        />
      </div>

      {/* 画像保存対象のTierリスト */}
      <div className={styles.tierList} id="tier-list-container">
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

      {/* TierEditDialog */}
      {selectedTenpo && selectedRank && (
        <TierEditDialog
          isOpen={isDialogOpen}
          tenpoName={selectedTenpo.tenpo_name}
          currentTier={selectedRank.rank_name}
          onClose={handleCloseDialog}
          onSave={handleSaveTier}
        />
      )}

    </div>
  );
};

export default TierList;
