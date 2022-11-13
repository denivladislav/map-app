import React, { useRef, useEffect, useState } from 'react';
// import cn from 'classnames';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { setAppState } from './slices/appStateSlice.js';
import { addFeature } from './slices/featuresSlice.js';
import { useDispatch, useSelector } from 'react-redux';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXZsYWRpc2xhdiIsImEiOiJjbGFkenZ6NjkwYmpiM3ZvNmFxdWdvcDlqIn0.PIrSj3itqhXnCtuAm84lBg';

const App = () =>  {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.appState.appState);
  const features = useSelector((state) => state.features.features);
  const isPlaceMarkerModeOn = appState === 'placeMarker';

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
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (features.length === 0) return;

    const el = document.createElement('div');
    el.className = 'marker';

    const marker = features[features.length - 1];

    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h3>${marker.properties.title}</h3><p>${marker.properties.description}</p>`
          )
      )
      .addTo(map.current);

  }, [features]);


  const handleClickButton = () => {
    // добавить условие, при котором по повторному нажатию возвращается стейт в исходное положение
    dispatch(setAppState('placeMarker'));
  }

  const handleClickMap = () => {
    if (!isPlaceMarkerModeOn) {
      return;
    }

    const marker = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [lng, lat],
      },
      'properties': {
        'title': 'Mapbox',
        'description': `${lng}, ${lat}`,
      }
    }

    dispatch(addFeature(marker));
    dispatch(setAppState('surfing'));
  }
  
  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="controlbar">
        <button className={`${isPlaceMarkerModeOn ? 'yellow' : 'red'}`} onClick={handleClickButton}>Add Marker</button>
      </div>
      <div id="map-container" ref={mapContainer} className={`map-container ${isPlaceMarkerModeOn ? 'cursor-default' : ''}`} onClick={handleClickMap} />
    </div>
  );
}

export default App;
