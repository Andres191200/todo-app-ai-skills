"use client";

import { useLanguage } from "../LanguageProvider";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <label htmlFor="todo-search" className={styles.label}>
        {t("searchTodos")}
      </label>
      <div className={styles.inputWrapper}>
        <svg
          className={styles.icon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M17.5 17.5L13.875 13.875M15.833 9.167a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0Z"
            stroke="currentColor"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          id="todo-search"
          type="search"
          className={styles.input}
          placeholder={t("searchTodos")}  
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
