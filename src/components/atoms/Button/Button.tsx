import React from 'react';
// @ts-ignore
import styles from './Button.module.css';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = ''
}) => {
  const buttonClass = `${styles.button} ${className}`.trim();

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
};

export default Button;
