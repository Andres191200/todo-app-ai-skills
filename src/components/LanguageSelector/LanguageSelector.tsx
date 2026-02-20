'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './LanguageSelector.module.scss'

type Language = 'en' | 'es'

interface LanguageOption {
  code: Language
  label: string
}

const languages: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
]

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = languages.find((lang) => lang.code === selectedLanguage)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code: Language) => {
    setSelectedLanguage(code)
    setIsOpen(false)
    // TODO: Implement language change logic here
  }

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
        <span className={styles.label}>{selectedOption?.label}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox" aria-label="Language options">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                className={`${styles.option} ${lang.code === selectedLanguage ? styles.selected : ''}`}
                onClick={() => handleSelect(lang.code)}
                role="option"
                aria-selected={lang.code === selectedLanguage}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
