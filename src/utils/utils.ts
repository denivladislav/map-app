import mapboxgl, { Marker, Map, EventData, Popup } from 'mapbox-gl';

export interface Line {
  lineId: string,
  lineSourceId: string,
  popup: Popup,
}

const getFormattedCurrentDate = (): string => {
  const now = new Date();
  const [month, day, year] = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
  return `${day}.${month}.${year}`;
}

export const createNewMarker = (lng: number, lat: number, map: Map): Marker => {
  const markerDescription = getFormattedCurrentDate();
  const markerTitle = 'Marker';

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

export const createNewLine = (lineStart: number[], lineEnd: number[], map: Map): Line => {
  const line: GeoJSON.Feature = {
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

  const lineId = `line-${counter}`;
  const lineSourceId = `line-${counter}-source`;

  map.addSource(lineSourceId, {
    type: 'geojson',
    data: line,
  });

  map.addLayer({
    id: lineId,
    type: 'line',
    source: lineSourceId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#888',
      'line-width': 8
    }
  });

  const popup = new mapboxgl.Popup();

  map.on('click', lineId, (e: EventData) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    popup
      .setLngLat(coordinates[0])
      .setHTML((
        `<h3>${line.properties?.title}</h3><p>${line.properties?.description}</p>`
      ))
      .addTo(map);
  });

  map.on('mouseenter', lineId, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', lineId, () => {
    map.getCanvas().style.cursor = '';
  });

  counter += 1;

  return {lineId, lineSourceId, popup};
};
