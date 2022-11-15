import { Marker, Map } from 'mapbox-gl';
import React, {useState, Dispatch, SetStateAction}  from 'react';
import { EAppStates, TAppState } from '../App';
import { createNewLine, createNewMarker, Line } from '../helpers/utils';

interface IMapProps {
  appState: TAppState,
  setAppState: Dispatch<SetStateAction<TAppState>>,
  markers: Marker[],
  setMarkers: Dispatch<SetStateAction<Marker[]>>,
  lines: Line[],
  setLines: Dispatch<SetStateAction<Line[]>>,
  map: Map,
  lng: number,
  lat: number,
}

export const MapContainer = React.forwardRef<HTMLDivElement, IMapProps>(({appState, setAppState, markers, setMarkers, lines, setLines, map, lng, lat}, ref) => {
  const isPlacingMarkerState = appState === EAppStates.PLACING_MARKER;
  const isPlacingLineStartState = appState === EAppStates.PLACING_LINE_START;
  const isPlacingLineEndState = appState === EAppStates.PLACING_LINE_END;
  const isPlacingLineState = isPlacingLineStartState || isPlacingLineEndState;
  const isPlacingFeatureState = isPlacingMarkerState || isPlacingLineState;

  const [lineStart, setLineStart] = useState<number[]>([]);

  const handleClickMap = () => {
    if (!isPlacingMarkerState && !isPlacingLineState) return;

    if (isPlacingMarkerState) {
      const newMarker = createNewMarker(lng, lat, map);
      setMarkers([...markers, newMarker]);
      setAppState(EAppStates.SURFING);
    }

    if (isPlacingLineStartState) {
      setLineStart([lng, lat]);
      setAppState(EAppStates.PLACING_LINE_END);
    }

    if (isPlacingLineEndState) {
      const lineEnd = [lng, lat];
      const newLine = createNewLine(lineStart, lineEnd, map);
      setLines([...lines, newLine]);
      setLineStart([]);
      setAppState(EAppStates.SURFING);
    }
  }

  return <div id="map-container" ref={ref} className={`map-container ${isPlacingFeatureState ? 'cursor-default' : ''}`} onClick={handleClickMap} />
});
