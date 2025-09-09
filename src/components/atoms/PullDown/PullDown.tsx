import React, { useState } from 'react';
// @ts-ignore
import styles from './PullDown.module.css';

interface PullDownProps {
  label: string;
  initialValue: string;
  onChange: (value: string) => void;
  className?: string;
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
  className = ''
}) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const pullDownClass = `${styles.pullDown} ${className}`.trim();

  return (
    <div className={pullDownClass}>
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
            {TIER_OPTIONS.map((option) => (
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
