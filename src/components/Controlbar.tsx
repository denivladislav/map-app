import React, { Dispatch, SetStateAction }  from 'react';
import { Marker } from 'mapbox-gl';
import { AppState, AppStates, Line } from '../helpers/types';
import { isEmpty } from 'lodash';

interface IControlbarProps {
  appState: AppState,
  setAppState: Dispatch<SetStateAction<AppState>>,
  areMarkersVisible: boolean,
  setMarkersVisible: Dispatch<SetStateAction<boolean>>,
  markers: Marker[],
  setMarkers: Dispatch<SetStateAction<Marker[]>>,
  areLinesVisible: boolean,
  setLinesVisible: Dispatch<SetStateAction<boolean>>,
  lines: Line[],
  setLines: Dispatch<SetStateAction<Line[]>>,
}

export const Controlbar = ({appState, setAppState, areMarkersVisible, setMarkersVisible, markers, setMarkers, areLinesVisible, setLinesVisible, lines, setLines}: IControlbarProps): JSX.Element => {
  const isPlacingMarkerState = appState === AppStates.PLACING_MARKER;
  const isPlacingLineStartState = appState === AppStates.PLACING_LINE_START;
  const isPlacingLineEndState = appState === AppStates.PLACING_LINE_END;
  const isPlacingLineState = isPlacingLineStartState || isPlacingLineEndState;

  const shouldExtraMarkerButtonsRender = !isEmpty(markers);
  const shouldExtraLineButtonsRender = !isEmpty(lines);

  const handleClickAddMarkerButton = () => {
    if (isPlacingMarkerState) {
      setAppState(AppStates.SURFING);
    } else {
      setAppState(AppStates.PLACING_MARKER);
      setMarkersVisible(true);
    }
  }

  const handleClickAddLineButton = () => {
    if (isPlacingLineState) {
      setAppState(AppStates.SURFING);
    } else {
      setAppState(AppStates.PLACING_LINE_START);
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
