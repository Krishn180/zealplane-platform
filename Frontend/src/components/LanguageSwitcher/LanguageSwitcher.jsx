import React, { useState, useEffect, useRef } from "react";
import { FaGlobe, FaChevronDown, FaCheck } from "react-icons/fa";
import "./LanguageSwitcher.scss";

export const INDIAN_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
];

const setGoogleTranslateCookie = (langCode) => {
  const cookieValue = langCode === "en" ? "/auto/en" : `/auto/${langCode}`;
  const hostname = window.location.hostname;
  const domain = hostname.includes("zealplane.com") ? ".zealplane.com" : hostname;

  document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;
  document.cookie = `googtrans=${cookieValue}; path=/;`;
  localStorage.setItem("zp_language", langCode);
};

const triggerGoogleTranslation = (langCode) => {
  setGoogleTranslateCookie(langCode);

  // Trigger Google Translate select element if initialized
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change"));
  } else {
    // If select not ready yet, reload with cookie to ensure translation applies
    window.location.reload();
  }
};

const LanguageSwitcher = ({ variant = "default" }) => {
  const [currentLang, setCurrentLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check saved language or cookie
    const saved = localStorage.getItem("zp_language");
    if (saved) {
      setCurrentLang(saved);
    } else {
      const match = document.cookie.match(/googtrans=\/auto\/([a-z]{2})/i);
      if (match && match[1]) {
        setCurrentLang(match[1]);
      }
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (langCode) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    triggerGoogleTranslation(langCode);
  };

  const activeLangObj = INDIAN_LANGUAGES.find((l) => l.code === currentLang) || INDIAN_LANGUAGES[0];

  return (
    <div className={`zp-lang-switcher zp-lang-switcher--${variant}`} ref={dropdownRef}>
      <button
        className="zp-lang-btn notranslate"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        type="button"
      >
        <FaGlobe className="zp-lang-icon" />
        <span className="zp-lang-current">{activeLangObj.nativeName}</span>
        <FaChevronDown className={`zp-lang-chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="zp-lang-dropdown notranslate">
          <div className="zp-lang-dropdown-header">
            <span>Select Language / भाषा चुनें</span>
          </div>
          <div className="zp-lang-list">
            {INDIAN_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`zp-lang-option ${currentLang === lang.code ? "active" : ""}`}
                onClick={() => handleSelectLanguage(lang.code)}
                type="button"
              >
                <span className="zp-lang-flag">{lang.flag}</span>
                <div className="zp-lang-names">
                  <span className="zp-lang-native">{lang.nativeName}</span>
                  <span className="zp-lang-english">({lang.name})</span>
                </div>
                {currentLang === lang.code && <FaCheck className="zp-lang-check" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
