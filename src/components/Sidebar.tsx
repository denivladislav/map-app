import React from 'react';

interface ISidebarProps {
  lng: number,
  lat: number,
  zoom: number,
}

export const Sidebar = ({lng, lat, zoom}: ISidebarProps): JSX.Element => {
  return (
    <div className="sidebar sidebar-top-left">
      Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
  );
}
