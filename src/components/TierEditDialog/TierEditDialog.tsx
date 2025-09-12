import React, { useState, useEffect } from 'react';
// @ts-ignore
import styles from './TierEditDialog.module.css';
import { TierEditDialogProps, TenpoData, RankData } from '../../types';
import PullDown from '../atoms/PullDown/PullDown';
import Button from '../atoms/Button/Button';
import { useDisplayOrder } from '../../hooks/useDisplayOrder';

interface ExtendedTierEditDialogProps extends TierEditDialogProps {
  tenpoData: TenpoData[];
  rankData: RankData[];
}

const TierEditDialog: React.FC<ExtendedTierEditDialogProps> = ({
  isOpen,
  tenpoName,
  currentTier,
  currentDisplayOrder,
  onClose,
  onSave,
  isSaving = false,
  saveError = null,
  tenpoData,
  rankData
}) => {
  const [selectedTier, setSelectedTier] = useState(currentTier);
  const [selectedDisplayOrder, setSelectedDisplayOrder] = useState(currentDisplayOrder.toString());

  // 表示順序の計算
  const { displayOrderOptions } = useDisplayOrder(
    tenpoData,
    rankData,
    selectedTier,
    currentTier,
    currentDisplayOrder
  );

  // 表示順序のオプションを文字列配列に変換
  const displayOrderStringOptions = displayOrderOptions.map(num => num.toString());

  // Tierが変更された時に表示順序をリセット
  useEffect(() => {
    if (selectedTier !== currentTier) {
      // 別Tierに移動する場合は1を選択
      setSelectedDisplayOrder('1');
    } else {
      // 同Tier内の場合は現在の値を維持
      setSelectedDisplayOrder(currentDisplayOrder.toString());
    }
  }, [selectedTier, currentTier, currentDisplayOrder]);

  const handleTierChange = (newTier: string) => {
    setSelectedTier(newTier);
  };

  const handleDisplayOrderChange = (newDisplayOrder: string) => {
    setSelectedDisplayOrder(newDisplayOrder);
  };

  const handleSave = () => {
    const newDisplayOrder = parseInt(selectedDisplayOrder, 10);
    onSave(selectedTier, newDisplayOrder);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2 className={styles.title}>{tenpoName}</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.tierSection}>
            <PullDown
              label="Tier"
              initialValue={currentTier}
              onChange={handleTierChange}
            />
          </div>

          <div className={styles.displayOrderSection}>
            <PullDown
              label="表示順序"
              initialValue={selectedDisplayOrder}
              onChange={handleDisplayOrderChange}
              options={displayOrderStringOptions}
            />
          </div>

          {/* 保存エラーメッセージの表示 */}
          {saveError && (
            <div className={styles.errorMessage}>
              <p>{saveError}</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            text={isSaving ? "保存中..." : "決定"}
            onClick={handleSave}
            className={styles.saveButton}
            disabled={isSaving}
          />
          <Button
            text="戻る"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default TierEditDialog;