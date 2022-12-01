import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import App from '../components/App';
import { I18nextProvider } from 'react-i18next';
import i18n from '../__tests-utils__/i18next-tests.js';

jest.mock('mapbox-gl', () => ({
  Map: function () {
    this.on = jest.fn();
    this.remove = jest.fn();
  },
}));

it('app renders', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <App isTesting={true} />
    </I18nextProvider>
  );

  const addMarkerButton = screen.getByText(i18n.t('controlbar.addMarker'));
  expect(addMarkerButton).toBeInTheDocument();
});
