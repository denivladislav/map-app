import React, { Dispatch, SetStateAction }  from 'react';
import { Marker } from 'mapbox-gl';
import { AppState, AppStates, Line } from '../helpers/types';
import { isEmpty } from 'lodash';
import cn from 'classnames';

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

  const handleClickHideMarkersButton = () => setMarkersVisible(!areMarkersVisible);

  const handleClickRemoveMarkersButton = () => setMarkers([]);

  const handleClickAddLineButton = () => {
    if (isPlacingLineState) {
      setAppState(AppStates.SURFING);
    } else {
      setAppState(AppStates.PLACING_LINE_START);
      setLinesVisible(true);
    }
  }

  const handleClickHideLinesButton = () => setLinesVisible(!areLinesVisible);

  const handleClickRemoveLinesButton = () => setLines([]);

  const renderAddMarkerButton = () => <button id="add-marker-button" className={cn('btn', 'mb-10', {'btn-pressed': isPlacingMarkerState})} onClick={handleClickAddMarkerButton}>Add Marker</button>

  const renderExtraMarkerButtons = () => {
    if (!shouldExtraMarkerButtonsRender) return null;

    return (
      <>
        <button className='btn mb-10' id="hide-markers-button" onClick={handleClickHideMarkersButton}>{areMarkersVisible ? 'Hide markers' : 'Show markers'}</button>
        <button className='btn mb-10' id="remove-markers-button" onClick={handleClickRemoveMarkersButton}>Remove markers</button>
      </>
    );
  };

  const renderAddLineButton = () => <button id="add-line-button" className={cn('btn', {'btn-pressed': isPlacingLineState, 'mb-10': shouldExtraLineButtonsRender})} onClick={handleClickAddLineButton}>Add Line</button>

  const renderExtraLineButtons = () => {
    if (!shouldExtraLineButtonsRender) return null;

    return (
      <>
        <button className='btn mb-10' id="hide-lines-button" onClick={handleClickHideLinesButton}>{areLinesVisible ? 'Hide lines' : 'Show lines'}</button>
        <button className='btn' id="remove-lines-button" onClick={handleClickRemoveLinesButton}>Remove lines</button>
      </>
    );
  }

  return (
    <div className="sidebar sidebar-top-right">
      <>
        {renderAddMarkerButton()}
        {renderExtraMarkerButtons()}
        {renderAddLineButton()}
        {renderExtraLineButtons()}
      </>
    </div>
  );
}
