import React, { useState } from 'react';
// @ts-ignore
import styles from './TierEditDialog.module.css';
import { TierEditDialogProps } from '../../types';
import PullDown from '../atoms/PullDown/PullDown';
import Button from '../atoms/Button/Button';

const TierEditDialog: React.FC<TierEditDialogProps> = ({
  isOpen,
  tenpoName,
  currentTier,
  onClose,
  onSave
}) => {
  const [selectedTier, setSelectedTier] = useState(currentTier);

  const handleTierChange = (newTier: string) => {
    setSelectedTier(newTier);
  };

  const handleSave = () => {
    onSave(selectedTier);
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
        </div>

        <div className={styles.actions}>
          <Button
            text="決定"
            onClick={handleSave}
            className={styles.saveButton}
          />
          <Button
            text="戻る"
            onClick={onClose}
            className={styles.cancelButton}
          />
        </div>
      </div>
    </div>
  );
};

export default TierEditDialog;