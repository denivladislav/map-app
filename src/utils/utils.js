import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

export const createNewMarker = ({lng, lat, map}) => {
  const marker = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [lng, lat],
    },
    'properties': {
      'title': 'Marker',
      'description': `${lng}, ${lat}`,
    }
  };

  const el = document.createElement('div');
  el.className = 'marker';

  const newMarker = new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<h3>${marker.properties.title}</h3><p>${marker.properties.description}</p>`
        )
    )
    .addTo(map);

  return newMarker;
}

export const createNewLine = ({lineStart, lineEnd, map}) => {
  const line = {
    'type': 'Feature',
    'geometry': {
      'type': 'LineString',
      'coordinates': [
        lineStart,
        lineEnd,
      ]
    },
    'properties': {
      'title': 'Line',
      'description': `its a line`,
    },
  }

  map.addSource('route', {
    'type': 'geojson',
    'data': line,
  });

  map.addLayer({
    'id': `route`,
    'type': 'line',
    'source': 'route',
    'layout': {
        'line-join': 'round',
        'line-cap': 'round'
    },
    'paint': {
        'line-color': '#888',
        'line-width': 8
    }
  });

  return line;
};
