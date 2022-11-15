import React from 'react';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import translationEN from './assets/locales/en.json';
import App from './components/App';

const init = async (): Promise<JSX.Element> => {
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'en',
    debug: false,
    resources: {
      en: {
        translation: translationEN,
      },
    },
  });

  return (
    <I18nextProvider i18n={i18nInstance}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </I18nextProvider>
  );
};

export default init;
