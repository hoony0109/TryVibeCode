import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const languages = [
        { code: 'ko', name: '한국어', flag: '🇰🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
    ];

    return (
        <div className="language-selector">
            <div className="language-dropdown">
                <button className="language-button">
                    <span className="flag">{languages.find(lang => lang.code === i18n.language)?.flag || '🇰🇷'}</span>
                    <span className="language-name">{languages.find(lang => lang.code === i18n.language)?.name || '한국어'}</span>
                    <span className="arrow">▼</span>
                </button>
                <div className="language-menu">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
                            onClick={() => changeLanguage(language.code)}
                        >
                            <span className="flag">{language.flag}</span>
                            <span className="language-name">{language.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector; 