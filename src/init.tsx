import React from 'react';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import mapboxgl from 'mapbox-gl';
import translationEN from './assets/locales/en.json';
import App from './components/App';
import { mapboxglAccessToken } from './helpers/data';
import 'mapbox-gl/dist/mapbox-gl.css';
import './assets/index.css';

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

  mapboxgl.accessToken = mapboxglAccessToken;

  return (
    <I18nextProvider i18n={i18nInstance}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </I18nextProvider>
  );
};

export default init;
