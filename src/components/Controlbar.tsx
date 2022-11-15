import React, {Dispatch, SetStateAction}  from 'react';
import { EAppStates, TAppState } from '../App';
import { Map, Marker } from 'mapbox-gl';
import { Line } from '../helpers/utils';

interface IControlbarProps {
  appState: TAppState,
  setAppState: Dispatch<SetStateAction<TAppState>>,
  areMarkersVisible: boolean,
  setMarkersVisible: Dispatch<SetStateAction<boolean>>,
  markers: Marker[],
  setMarkers: Dispatch<SetStateAction<Marker[]>>,
  areLinesVisible: boolean,
  setLinesVisible: Dispatch<SetStateAction<boolean>>,
  lines: Line[],
  setLines: Dispatch<SetStateAction<Line[]>>,
  map: Map,
}

export const Controlbar = ({appState, setAppState, areMarkersVisible, setMarkersVisible, markers, setMarkers, areLinesVisible, setLinesVisible, lines, setLines, map}: IControlbarProps): JSX.Element => {
  const isPlacingMarkerState = appState === EAppStates.PLACING_MARKER;
  const isPlacingLineStartState = appState === EAppStates.PLACING_LINE_START;
  const isPlacingLineEndState = appState === EAppStates.PLACING_LINE_END;
  const isPlacingLineState = isPlacingLineStartState || isPlacingLineEndState;
  const shouldExtraMarkerButtonsRender = markers.length > 0;
  const shouldExtraLineButtonsRender = lines.length > 0;

  const handleClickAddMarkerButton = () => {
    if (isPlacingMarkerState) {
      setAppState(EAppStates.SURFING);
    } else {
      setAppState(EAppStates.PLACING_MARKER);
      setMarkersVisible(true);
    }
  }

  const handleClickAddLineButton = () => {
    if (isPlacingLineState) {
      setAppState(EAppStates.SURFING);
    } else {
      setAppState(EAppStates.PLACING_LINE_START);
      setLinesVisible(true);
    }
  }

  const handleClickHideMarkersButton = () => setMarkersVisible(!areMarkersVisible);

  const handleClickRemoveMarkersButton = () => setMarkers([]);

  const handleClickHideLinesButton = () => setLinesVisible(!areLinesVisible);

  const handleClickRemoveLinesButton = () => setLines([]);

  const renderHideMarkersButton = () => <button id="hide-markers-button" onClick={handleClickHideMarkersButton}>{areMarkersVisible ? 'Hide markers' : 'Show markers'}</button>

  const renderRemoveMarkersButton = () => <button id="remove-markers-button" onClick={handleClickRemoveMarkersButton}>Remove markers</button>

  const renderHideLinesButton = () => <button id="hide-lines-button" onClick={handleClickHideLinesButton}>{areLinesVisible ? 'Hide lines' : 'Show lines'}</button>;

  const renderRemoveLinesButton = () => <button id="remove-lines-button" onClick={handleClickRemoveLinesButton}>Remove lines</button>;

  return (
    <div className="controlbar">
      <button id="add-marker-button" className={`${isPlacingMarkerState ? 'pressed' : 'default'}`} onClick={handleClickAddMarkerButton}>Add Marker</button>
      {shouldExtraMarkerButtonsRender && renderHideMarkersButton()}
      {shouldExtraMarkerButtonsRender && renderRemoveMarkersButton()}
      <button id="add-line-button" className={`${isPlacingLineState ? 'pressed' : 'default'}`} onClick={handleClickAddLineButton}>Add Line</button>
      {shouldExtraLineButtonsRender && renderHideLinesButton()}
      {shouldExtraLineButtonsRender && renderRemoveLinesButton()}
    </div>
  );
}
