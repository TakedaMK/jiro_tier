import React from 'react';
// @ts-ignore
import styles from './Tenpo.module.css';

interface TenpoProps {
  name: string;
  onClick: () => void;
  className?: string;
}

const Tenpo: React.FC<TenpoProps> = ({
  name,
  onClick,
  className = ''
}) => {
  const tenpoClass = `${styles.tenpo} ${className}`.trim();

  return (
    <button
      className={tenpoClass}
      onClick={onClick}
      type="button"
    >
      {name}
    </button>
  );
};

export default Tenpo;
