import React from 'react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string,
  searchIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Buscar',
  className = '',
  searchIcon = '🔍',
  clearIcon = '✖',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={styles.searchBar}>
      <div className={`${styles.searchBarContent} ${className}`}>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />

        {value && onClear && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={onClear}
            aria-label="Limpiar búsqueda">
            {clearIcon}
          </button>
        )}

        <button
          type="button"
          className={styles.searchBtn}
          onClick={onSubmit}
          aria-label="Buscar"
        >
          {searchIcon}
        </button>
      </div>
    </div >
  );
};
