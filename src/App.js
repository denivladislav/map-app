import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import cn from 'classnames';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { setAppState } from './slices/appStateSlice.js';
import { addFeature } from './slices/featuresSlice.js';
import { addMarkerToMap, getNewMarker } from './utils/utils.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXZsYWRpc2xhdiIsImEiOiJjbGFkenZ6NjkwYmpiM3ZvNmFxdWdvcDlqIn0.PIrSj3itqhXnCtuAm84lBg';

const App = () =>  {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.appState.appState);
  const features = useSelector((state) => state.features.features);
  const isPlaceFeatureState= appState === 'placeFeature';

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

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

  useEffect(() => {
    if (features.length === 0) return;

    addMarkerToMap(map.current, features[features.length - 1]);
  }, [features]);


  const handleClickAddMarkerButton = () => {
    if (appState === 'placeFeature') {
      dispatch(setAppState('surfing'));
    } else {
      dispatch(setAppState('placeFeature'));
    }
  }

  const handleClickMap = () => {
    if (!isPlaceFeatureState) return;

    const marker = getNewMarker(lng, lat);

    dispatch(addFeature(marker));
    dispatch(setAppState('surfing'));
  }
  
  return (
    <>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="controlbar">
        <button id="add-marker-button" className={`${isPlaceFeatureState ? 'yellow' : 'red'}`} onClick={handleClickAddMarkerButton}>Add Marker</button>
      </div>
      <div id="map-container" ref={mapContainer} className={`map-container ${isPlaceFeatureState ? 'cursor-default' : ''}`} onClick={handleClickMap} />
    </>
  );
}

export default App;
