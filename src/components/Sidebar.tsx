import React from 'react';
import { useTranslation } from 'react-i18next';

interface ISidebarProps {
  lng: number,
  lat: number,
  zoom: number,
}

export const Sidebar = ({lng, lat, zoom}: ISidebarProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="sidebar sidebar-top-left">
      <>
        {t('sidebar.longitude', { longitude: String(lng) })}
        {t('divider')}
        {t('sidebar.latitude', { lat: String(lat) })}
        {t('divider')}
        {t('sidebar.zoom', { zoom: String(zoom) })}
      </>
    </div>
  );
}
