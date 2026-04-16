import i18n from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { commonResources } from 'tycho-components';
import { MessageTexts } from './localization/MessageTexts';
import { HomeTexts } from './localization/HomeTexts';

export default function configLocalization() {
  const languages = ['en', 'pt-BR', 'it'];
  const namespaces = {
    home: HomeTexts,
    message: MessageTexts,
  };

  const resources = languages.reduce((acc, lng) => {
    acc[lng] = {
      ...(commonResources as Record<string, Record<string, any>>)[lng],
      ...Object.entries(namespaces).reduce((nsAcc, [ns, texts]) => {
        nsAcc[ns] = (texts as Record<string, any>)[lng];
        return nsAcc;
      }, {} as Record<string, any>),
    };
    return acc;
  }, {} as Record<string, any>);

  i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
      resources,
      fallbackLng: 'en',
      defaultNS: 'message',
      interpolation: {
        escapeValue: false,
      },
    });
}
