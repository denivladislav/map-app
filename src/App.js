import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import cn from 'classnames';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { setAppState } from './slices/appStateSlice.js';
import { createNewMarker, createNewLine } from './utils/utils.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXZsYWRpc2xhdiIsImEiOiJjbGFkenZ6NjkwYmpiM3ZvNmFxdWdvcDlqIn0.PIrSj3itqhXnCtuAm84lBg';

const App = () =>  {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.appState.appState);
  const isPlaceMarkerState = appState === 'placeMarker';
  const isPlaceLineStartState = appState === 'placeLineStart';
  const isPlaceLineEndState = appState === 'placeLineEnd';
  const isPlaceLineState = isPlaceLineStartState || isPlaceLineEndState;
  const isPlaceFeatureState = isPlaceMarkerState || isPlaceLineState;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(37.6);
  const [lat, setLat] = useState(55.75);
  const [zoom, setZoom] = useState(9);

  const [lineStart, setLineStart] = useState(null);

  const [markers, setMarkers] = useState([]);
  const [lines, setLines] = useState([]);

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
    if (isPlaceMarkerState) {
      dispatch(setAppState('surfing'));
    } else {
      dispatch(setAppState('placeMarker'));
    }
  }

  const handleClickAddLineButton = () => {
    if (isPlaceLineState) {
      dispatch(setAppState('surfing'));
    } else {
      dispatch(setAppState('placeLineStart'));
    }
  }

  const handleClickMap = () => {
    if (!isPlaceMarkerState && !isPlaceLineState) return;

    if (isPlaceMarkerState) {
      const newMarker = createNewMarker({lng, lat, map: map.current});
      setMarkers([...markers, newMarker]);
      dispatch(setAppState('surfing'));
    }

    if (isPlaceLineStartState) {
      console.log('Here1');
      setLineStart([lng, lat]);
      dispatch(setAppState('placeLineEnd'));
    }

    if (isPlaceLineEndState) {
      const lineEnd = [lng, lat];
      const newLine = createNewLine({lineStart, lineEnd, map: map.current});
      setLines([...lines, newLine]);
      setLineStart(null);
      dispatch(setAppState('surfing'));
    }
  }
  
  return (
    <>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="controlbar">
        <button id="add-marker-button" className={`${isPlaceMarkerState ? 'pressed' : 'default'}`} onClick={handleClickAddMarkerButton}>Add Marker</button>
        <button id="add-line-button" className={`${isPlaceLineState ? 'pressed' : 'default'}`} onClick={handleClickAddLineButton}>Add Line</button>
      </div>
      <div id="map-container" ref={mapContainer} className={`map-container ${isPlaceFeatureState ? 'cursor-default' : ''}`} onClick={handleClickMap} />
    </>
  );
}

export default App;
