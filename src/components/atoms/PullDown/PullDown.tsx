import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import styles from './PullDown.module.css';

interface PullDownProps {
  label: string;
  initialValue: string;
  onChange: (value: string) => void;
  className?: string;
  options?: string[]; // カスタムオプション（表示順序用）
  isOpen?: boolean; // 外部からの開閉制御
  onToggle?: () => void; // 開閉時のコールバック
}

const TIER_OPTIONS = [
  'SSS',
  'SS',
  'S',
  'A+',
  'A',
  'A-',
  'B',
  'C'
];

const PullDown: React.FC<PullDownProps> = ({
  label,
  initialValue,
  onChange,
  className = '',
  options,
  isOpen: externalIsOpen,
  onToggle
}) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 外部制御がある場合はそれを使用、なければ内部状態を使用
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    // 外部制御がある場合はonToggleを呼び出し、なければ内部状態を更新
    if (externalIsOpen !== undefined && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    // 外部制御がある場合はonToggleを呼び出し、なければ内部状態を更新
    if (externalIsOpen !== undefined && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  // 外側クリック時の処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // プルダウンが開いている場合のみ閉じる
        if (isOpen) {
          if (externalIsOpen !== undefined && onToggle) {
            onToggle();
          } else {
            setInternalIsOpen(false);
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, externalIsOpen, onToggle]);

  const pullDownClass = `${styles.pullDown} ${className}`.trim();

  // カスタムオプションが指定されている場合はそれを使用、そうでなければTIER_OPTIONSを使用
  const displayOptions = options || TIER_OPTIONS;

  return (
    <div className={pullDownClass} ref={dropdownRef}>
      <label className={styles.label}>{label}</label>
      <div className={styles.dropdownContainer}>
        <button
          className={styles.dropdownButton}
          onClick={toggleDropdown}
          type="button"
        >
          <span className={styles.selectedValue}>{selectedValue}</span>
          <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div className={styles.dropdownList}>
            {displayOptions.map((option) => (
              <button
                key={option}
                className={`${styles.dropdownItem} ${selectedValue === option ? styles.selected : ''}`}
                onClick={() => handleSelect(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PullDown;