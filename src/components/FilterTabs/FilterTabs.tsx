"use client";

import type { FilterStatus } from "@/types/todo";
import styles from "./FilterTabs.module.scss";
import { useLanguage } from "../LanguageProvider";
import en from "@/locales/en.json";
import { useEffect, useMemo, useState } from "react";

interface FilterTabsProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  counts: { all: number; active: number; completed: number };
}

function setFilterLabels(t: (key: keyof typeof en) => string) {
  const filters: { value: FilterStatus; label: string }[] = [
    { value: "all", label: t("filterAll") },
    { value: "active", label: t("filterActive") },
    { value: "completed", label: t("filterCompleted") },
  ];

  return filters;
}

export function FilterTabs({
  filter,
  onFilterChange,
  counts,
}: FilterTabsProps) {
  const { t } = useLanguage();
  console.log('re-renderr');

  const filters = setFilterLabels(t);

  // const filters = useMemo(() => {
  //   return setFilterLabels(t);
  // }, [t]);

  return (
    <div className={styles.tabs} role="tablist" aria-label="Filter todos">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={filter === value}
          className={`${styles.tab} ${filter === value ? styles.active : ""}`}
          onClick={() => onFilterChange(value)}
          type="button"
        >
          {label}
          <span className={styles.count}>{counts[value]}</span>
        </button>
      ))}
    </div>
  );
}
