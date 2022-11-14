import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import { createNewMarker, createNewLine, Line } from './utils/utils';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXZsYWRpc2xhdiIsImEiOiJjbGFkenZ6NjkwYmpiM3ZvNmFxdWdvcDlqIn0.PIrSj3itqhXnCtuAm84lBg';

enum AppStates {
  'SURFING',
  'PLACING_MARKER',
  'PLACING_LINE_START',
  'PLACING_LINE_END',
}

type AppState = keyof typeof AppStates;

const App = () =>  {
  const [appState, setAppState] = useState<AppState>('SURFING');
  const isPlacingMarkerState = appState === 'PLACING_MARKER';
  const isPlacingLineStartState = appState === 'PLACING_LINE_START';
  const isPlacingLineEndState = appState === 'PLACING_LINE_END';
  const isPlacingLineState = isPlacingLineStartState || isPlacingLineEndState;
  const isPlacingFeatureState = isPlacingMarkerState || isPlacingLineState;

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [lng, setLng] = useState<number>(37.6);
  const [lat, setLat] = useState<number>(55.75);
  const [zoom, setZoom] = useState<number>(9);

  const [markers, setMarkers] = useState<Marker[]>([]);
  const [areMarkersVisible, setMarkersVisible] = useState<boolean>(true);

  const [lines, setLines] = useState<Line[]>([]);
  const [lineStart, setLineStart] = useState<number[]>([]);
  const [areLinesVisible, setLinesVisible] = useState<boolean>(true);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return;

    map.current.on('mousemove', ({lngLat}) => {
      setLng(Number(lngLat.lng.toFixed(4)));
      setLat(Number(lngLat.lat.toFixed(4)));
    });

    map.current.on('move', () => {
      setZoom(Number(map.current!.getZoom().toFixed(2)));
    });
  });

  const handleClickAddMarkerButton = () => {
    if (isPlacingMarkerState) {
      setAppState('SURFING');
    } else {
      setAppState('PLACING_MARKER');
    }
  }

  const handleClickAddLineButton = () => {
    if (isPlacingLineState) {
      setAppState('SURFING');
    } else {
      setAppState('PLACING_LINE_START');
    }
  }

  const handleClickMap = () => {
    if (!isPlacingMarkerState && !isPlacingLineState) return;

    if (isPlacingMarkerState) {
      const newMarker = createNewMarker(lng, lat, map.current!);
      setMarkers([...markers, newMarker]);
      setAppState('SURFING');
    }

    if (isPlacingLineStartState) {
      setLineStart([lng, lat]);
      setAppState('PLACING_LINE_END');
    }

    if (isPlacingLineEndState) {
      const lineEnd = [lng, lat];
      const newLine = createNewLine(lineStart, lineEnd, map.current!);
      setLines([...lines, newLine]);
      setLineStart([]);
      setAppState('SURFING');
    }
  }

  const handleClickHideMarkersButton = () => {
    markers.forEach((marker) => {
      marker.remove();
      if (!areMarkersVisible) {
        marker.addTo(map.current!);
      }
    });
    setMarkersVisible(!areMarkersVisible);
  }

  const handleClickRemoveMarkersButton = () => {
    markers.forEach((marker) => marker.remove());
    setMarkers([]);
  }

  const handleClickHideLinesButton = () => {
    lines.forEach(({lineId}) => map.current?.setLayoutProperty(lineId, 'visibility', areLinesVisible ? 'none': 'visible'));
    setLinesVisible(!areLinesVisible);
  }

  const handleClickRemoveLinesButton = () => {
    lines.forEach(({lineId, lineSourceId, popup}) => {
      map.current?.removeLayer(lineId);
      map.current?.removeSource(lineSourceId);
      popup.remove();
    });
    setLines([]);
  }

  const renderHideMarkersButton = () => {
    return (
      <button id="hide-markers-button" onClick={handleClickHideMarkersButton}>{areMarkersVisible ? 'Hide markers' : 'Show markers'}</button>
    );
  }

  const renderRemoveMarkersButton = () => {
    return (
      <button id="remove-markers-button" onClick={handleClickRemoveMarkersButton}>Remove markers</button>
    );
  }

  const renderHideLinesButton = () => {
    return (
      <button id="remove-lines-button" onClick={handleClickHideLinesButton}>{areLinesVisible ? 'Hide lines' : 'Show lines'}</button>
    );
  }

  const renderRemoveLinesButton = () => {
    return (
      <button id="remove-lines-button" onClick={handleClickRemoveLinesButton}>Remove lines</button>
    );
  }
  
  return (
    <>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="controlbar">
        <button id="add-marker-button" className={`${isPlacingMarkerState ? 'pressed' : 'default'}`} onClick={handleClickAddMarkerButton}>Add Marker</button>
        {markers.length > 0 && renderHideMarkersButton()}
        {markers.length > 0 && renderRemoveMarkersButton()}
        <button id="add-line-button" className={`${isPlacingLineState ? 'pressed' : 'default'}`} onClick={handleClickAddLineButton}>Add Line</button>
        {lines.length > 0 && renderHideLinesButton()}
        {lines.length > 0 && renderRemoveLinesButton()}
      </div>
      <div id="map-container" ref={mapContainer} className={`map-container ${isPlacingFeatureState ? 'cursor-default' : ''}`} onClick={handleClickMap} />
    </>
  );
}

export default App;
