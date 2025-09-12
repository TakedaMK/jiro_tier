import React, { useState, useEffect } from 'react';
import TierSection from './TierSection';
import TierEditDialog from '../TierEditDialog/TierEditDialog';
import Button from '../atoms/Button/Button';
import { TierListProps, TenpoData, RankData } from '../../types';
import { getTierListData } from '../../services/getTierList';
import { updateTenpoTierAndDisplayOrderByName } from '../../services/editTier';
import { getTenposByRank } from '../../data/dummyData';
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

  // Firestoreデータのstate管理
  const [tenpoData, setTenpoData] = useState<TenpoData[]>([]);
  const [rankData, setRankData] = useState<RankData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tier保存処理のstate管理
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 画像保存機能のフック
  const { saveAsImage } = useImageSave();

  // Firestoreからデータを取得する関数
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { tenpos, ranks } = await getTierListData();
      setTenpoData(tenpos);
      setRankData(ranks);
    } catch (err) {
      console.error('データの取得に失敗しました:', err);
      setError('データの取得に失敗しました。ページを再読み込みしてください。');
    } finally {
      setIsLoading(false);
    }
  };

  // Firestoreからデータを取得するuseEffect
  useEffect(() => {
    fetchData();
  }, []);

  // 店舗データから店舗名とTierを取得する関数
  const getTenpoInfo = (tenpo_CD: number) => {
    const tenpo = tenpoData.find(t => t.tenpo_CD === tenpo_CD);
    const rank = rankData.find(r => r.rank_CD === tenpo?.rank_CD);
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

  // Tierと表示順序を保存する処理
  const handleSaveTierAndDisplayOrder = async (newTier: string, newDisplayOrder: number) => {
    if (!selectedTenpo) {
      console.error('選択された店舗がありません');
      return;
    }

    try {
      // 保存処理開始
      setIsSaving(true);
      setSaveError(null);

      console.log(`店舗 ${selectedTenpo.tenpo_name} のTierを ${newTier}、表示順序を ${newDisplayOrder} に変更中...`);

      // editTierサービスを使用してDBに保存
      await updateTenpoTierAndDisplayOrderByName(selectedTenpo.tenpo_CD, newTier, newDisplayOrder);

      console.log(`店舗 ${selectedTenpo.tenpo_name} のTierを ${newTier}、表示順序を ${newDisplayOrder} に変更しました`);

      // 保存成功後、データを再取得して画面を更新
      await fetchData();

      // ダイアログを閉じる
      handleCloseDialog();

    } catch (error) {
      console.error('Tierと表示順序の保存に失敗しました:', error);
      setSaveError('Tierと表示順序の保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  // 画像として保存するハンドラー
  const handleSaveAsImage = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `tier-list-${timestamp}.png`;
    saveAsImage('tier-list-container', filename);
  };

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className={styles.tierListContainer}>
        <h1 className={styles.title}>ラーメン二郎 Tier List</h1>
        <div className={styles.loadingContainer}>
          <p>データを読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態の表示
  if (error) {
    return (
      <div className={styles.tierListContainer}>
        <h1 className={styles.title}>ラーメン二郎 Tier List</h1>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <Button
            text="再読み込み"
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          />
        </div>
      </div>
    );
  }

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
        {rankData.map((rank) => {
          const tenpos = getTenposByRank(tenpoData, rank.rank_CD);

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
          currentDisplayOrder={selectedTenpo.display_order}
          onClose={handleCloseDialog}
          onSave={handleSaveTierAndDisplayOrder}
          isSaving={isSaving}
          saveError={saveError}
          tenpoData={tenpoData}
          rankData={rankData}
        />
      )}


    </div>
  );
};

export default TierList;