import { Popup, AnySourceData, AnyLayer } from 'mapbox-gl';

export enum AppStates {
  'SURFING' = 'SURFING',
  'PLACING_MARKER' = "PLACING_MARKER",
  'PLACING_LINE_START' = 'PLACING_LINE_START',
  'PLACING_LINE_END' = 'PLACING_LINE_END',
}

export type AppState = keyof typeof AppStates;

export interface Line {
  lineSource: AnySourceData,
  lineLayer: AnyLayer,
  lineId: string,
  lineSourceId: string,
  popup: Popup,
}
