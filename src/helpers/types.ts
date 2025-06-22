import { Popup } from 'mapbox-gl';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

export enum AppStates {
  SURFING = 'SURFING',
  PLACING_MARKER = 'PLACING_MARKER',
  PLACING_LINE_START = 'PLACING_LINE_START',
  PLACING_LINE_END = 'PLACING_LINE_END',
}

export type AppState = keyof typeof AppStates;

export interface Line {
  lineData: Feature<Geometry, GeoJsonProperties>;
  lineId: string;
  lineSourceId: string;
  popup: Popup;
}
