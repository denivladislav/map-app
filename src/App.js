import React, { useRef, useEffect, useState } from 'react';
// import cn from 'classnames';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { createNewMarker, createNewLine } from './utils/utils.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXZsYWRpc2xhdiIsImEiOiJjbGFkenZ6NjkwYmpiM3ZvNmFxdWdvcDlqIn0.PIrSj3itqhXnCtuAm84lBg';

const App = () =>  {
  const [appState, setAppState] = useState('surfing');
  const isPlacingMarkerState = appState === 'placingMarker';
  const isPlacingLineStartState = appState === 'placingLineStart';
  const isPlacingLineEndState = appState === 'placingLineEnd';
  const isPlacingLineState = isPlacingLineStartState || isPlacingLineEndState;
  const isPlacingFeatureState = isPlacingMarkerState || isPlacingLineState;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(37.6);
  const [lat, setLat] = useState(55.75);
  const [zoom, setZoom] = useState(9);

  const [markers, setMarkers] = useState([]);
  const [areMarkersVisible, setMarkersVisible] = useState(true);

  const [lines, setLines] = useState([]);
  const [lineStart, setLineStart] = useState(null);
  const [areLinesVisible, setLinesVisible] = useState(true);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return;

    map.current.on('mousemove', ({lngLat}) => {
      setLng(lngLat.lng.toFixed(4));
      setLat(lngLat.lat.toFixed(4));
    });

    map.current.on('move', () => {
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const handleClickAddMarkerButton = () => {
    if (isPlacingMarkerState) {
      setAppState('surfing');
    } else {
      setAppState('placingMarker');
    }
  }

  const handleClickAddLineButton = () => {
    if (isPlacingLineState) {
      setAppState('surfing');
    } else {
      setAppState('placingLineStart');
    }
  }

  const handleClickMap = () => {
    if (!isPlacingMarkerState && !isPlacingLineState) return;

    if (isPlacingMarkerState) {
      const newMarker = createNewMarker({lng, lat, map: map.current});
      setMarkers([...markers, newMarker]);
      setAppState('surfing');
    }

    if (isPlacingLineStartState) {
      setLineStart([lng, lat]);
      setAppState('placingLineEnd');
    }

    if (isPlacingLineEndState) {
      const lineEnd = [lng, lat];
      const newLine = createNewLine({lineStart, lineEnd, map: map.current});
      setLines([...lines, newLine]);
      setLineStart(null);
      setAppState('surfing');
    }
  }

  const handleClickHideMarkersButton = () => {
    markers.forEach((marker) => marker._element.style.visibility = areMarkersVisible ? 'hidden' : 'visible');
    setMarkersVisible(!areMarkersVisible);
  }

  const handleClickRemoveMarkersButton = () => {
    markers.forEach((marker) => marker.remove());
    setMarkers([]);
  }

  const handleClickHideLinesButton = () => {
    lines.forEach(({lineId}) => map.current.setLayoutProperty(lineId, 'visibility', areLinesVisible ? 'none': 'visible'));
    setLinesVisible(!areLinesVisible);
  }

  const handleClickRemoveLinesButton = () => {
    lines.forEach(({lineId, lineSourceId}) => {
      map.current.removeLayer(lineId);
      map.current.removeSource(lineSourceId);
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
