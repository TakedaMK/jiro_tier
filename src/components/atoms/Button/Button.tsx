import React from 'react';
// @ts-ignore
import styles from './Button.module.css';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = '',
  disabled = false
}) => {
  const buttonClass = `${styles.button} ${className}`.trim();

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
