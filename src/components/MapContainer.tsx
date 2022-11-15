import { Marker } from 'mapbox-gl';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { AppState, AppStates, Line } from '../helpers/types';
import { createNewLine, createNewMarker } from '../helpers/utils';
import cn from 'classnames';

interface IMapContainerProps {
  appState: AppState;
  setAppState: Dispatch<SetStateAction<AppState>>;
  markers: Marker[];
  setMarkers: Dispatch<SetStateAction<Marker[]>>;
  lines: Line[];
  setLines: Dispatch<SetStateAction<Line[]>>;
  lng: number;
  lat: number;
}

export const MapContainer = React.forwardRef<
  HTMLDivElement,
  IMapContainerProps
>(
  (
    { appState, setAppState, markers, setMarkers, lines, setLines, lng, lat },
    ref
  ) => {
    console.log('!');
    const isPlacingMarkerState = appState === AppStates.PLACING_MARKER;
    const isPlacingLineStartState = appState === AppStates.PLACING_LINE_START;
    const isPlacingLineEndState = appState === AppStates.PLACING_LINE_END;
    const isPlacingLineState = isPlacingLineStartState || isPlacingLineEndState;
    const isPlacingFeatureState = isPlacingMarkerState || isPlacingLineState;

    const [lineStart, setLineStart] = useState<number[]>([]);

    const handleClickMap = () => {
      if (!isPlacingMarkerState && !isPlacingLineState) return;

      if (isPlacingMarkerState) {
        const newMarker = createNewMarker(lng, lat);
        setMarkers([...markers, newMarker]);
        setAppState(AppStates.SURFING);
      }

      if (isPlacingLineStartState) {
        setLineStart([lng, lat]);
        setAppState(AppStates.PLACING_LINE_END);
      }

      if (isPlacingLineEndState) {
        const lineEnd = [lng, lat];
        const newLine = createNewLine(lineStart, lineEnd);
        setLines([...lines, newLine]);
        setLineStart([]);
        setAppState(AppStates.SURFING);
      }
    };

    return (
      <div
        id="map-container"
        ref={ref}
        className={cn('map-container', {
          'cursor-crosshair': isPlacingFeatureState,
        })}
        onClick={handleClickMap}
      />
    );
  }
);
