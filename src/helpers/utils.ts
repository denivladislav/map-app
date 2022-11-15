import mapboxgl, { Marker, LngLatLike, AnySourceData, AnyLayer } from 'mapbox-gl';
import { mean } from 'lodash';
import { Line } from './types';

const getFormattedCurrentDate = (): string => {
  const now = new Date();
  const [day, month, year] = [now.getDate(), now.getMonth() + 1, now.getFullYear()];
  return `${day}.${month}.${year}`;
}

const getFormattedArithmeticMean = (numbers: number[], toDigit: number): number => Number(mean(numbers).toFixed(toDigit));

const getLineMid = ([lngStart, latStart]: number[], [lngEnd, latEnd]: number[]): LngLatLike => ({lng: getFormattedArithmeticMean([lngStart, lngEnd], 4), lat: getFormattedArithmeticMean([latStart, latEnd], 4)});

export const createNewMarker = (lng: number, lat: number): Marker => {
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

  return newMarker;
}

let counter = 0;

export const createNewLine = (lineStart: number[], lineEnd: number[]): Line => {
  getLineMid(lineStart, lineEnd);
  const lineData: GeoJSON.Feature = {
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
  const popup = new mapboxgl.Popup()
    .setLngLat(getLineMid(lineStart, lineEnd))
    .setHTML((
      `<h3>${lineData.properties?.title}</h3><p>${lineData.properties?.description}</p>`
    ))

  const lineSource: AnySourceData = {
    type: 'geojson',
    data: lineData,
  }
  
  const lineLayer: AnyLayer = {
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
  }

  counter += 1;

  return {lineId, lineSource, lineLayer, lineSourceId, popup};
};
