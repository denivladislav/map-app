import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

export const getNewMarker = (lng, lat) => (
  {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [lng, lat],
    },
    'properties': {
      'title': 'Marker',
      'description': `${lng}, ${lat}`,
  }
});

export const addMarkerToMap = (map, marker) => {
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<h3>${marker.properties.title}</h3><p>${marker.properties.description}</p>`
        )
    )
    .addTo(map);
}