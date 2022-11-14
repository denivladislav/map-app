import mapboxgl, { Marker, Map, EventData } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

const getFormattedCurrentDate = (): string => {
  const now = new Date();
  const [month, day, year] = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
  return `${day}.${month}.${year}`;
}

export const createNewMarker = (lng: number, lat: number, map: Map): Marker => {
  const markerDescription = getFormattedCurrentDate();
  const markerTitle = 'Marker;'

  const el = document.createElement('div');
  el.className = 'marker';

  const newMarker = new mapboxgl.Marker(el)
    .setLngLat({lng, lat})
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<h3>${markerTitle}</h3><p>${markerDescription}</p>`
        )
    )
    .addTo(map)

  return newMarker;
}

let counter = 0;

export const createNewLine = (lineStart: number[], lineEnd: number[], map: Map) => {
  const newLine: GeoJSON.Feature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
          lineStart,
          lineEnd,
        ]
      },
    properties: {
      title: 'Line',
      description: getFormattedCurrentDate(),
    },
  }

  const newLineId = `line-${counter}`;
  const newLineSourceId = `line-${counter}-source`;

  map.addSource(newLineSourceId, {
    type: 'geojson',
    data: newLine,
  });

  map.addLayer({
    id: newLineId,
    type: 'line',
    source: newLineSourceId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#888',
      'line-width': 8
    }
  });

  map.on('click', newLineId, (e: EventData) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    new mapboxgl.Popup()
      .setLngLat(coordinates[0])
      .setHTML((
        `<h3>${newLine.properties?.title}</h3><p>${newLine.properties?.description}</p>`
      ))
      .addTo(map);
  });

  map.on('mouseenter', newLineId, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', newLineId, () => {
    map.getCanvas().style.cursor = '';
  });

  counter += 1;

  return {lineId: newLineId, lineSourceId: newLineSourceId};
};
