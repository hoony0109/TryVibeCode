import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';



i18n
  .use(Backend) // 백엔드 플러그인을 사용하여 JSON 파일을 로드
  .use(LanguageDetector) // 브라우저 언어 감지
  .use(initReactI18next)  
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;
