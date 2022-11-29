import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import { Sidebar } from './Sidebar';
import { Controlbar } from './Controlbar';
import { MapContainer } from './MapContainer';
import { Line, AppState, AppStates } from '../helpers/types';
import { mapStyle } from '../helpers/data';

const App = (): JSX.Element => {
  const [appState, setAppState] = useState<AppState>(AppStates.SURFING);

  const [lng, setLng] = useState<number>(37.6);
  const [lat, setLat] = useState<number>(55.75);
  const [zoom, setZoom] = useState<number>(9);

  const [markers, setMarkers] = useState<Marker[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  const [areMarkersVisible, setMarkersVisible] = useState<boolean>(true);
  const [areLinesVisible, setLinesVisible] = useState<boolean>(true);

  const prevMarkersRef = useRef<Marker[]>();
  const prevLinesRef = useRef<Line[]>();

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>();

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: mapStyle,
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return;

    map.current.on('mousemove', ({ lngLat }) => {
      setLng(Number(lngLat.lng.toFixed(4)));
      setLat(Number(lngLat.lat.toFixed(4)));
    });

    map.current.on('move', () => {
      setZoom(Number(map.current!.getZoom().toFixed(2)));
    });
  });

  useEffect(() => {
    if (!map.current) return;

    prevMarkersRef.current?.forEach((marker) => {
      marker.remove();
    });

    if (!areMarkersVisible) return;

    markers.forEach((marker) => {
      marker.addTo(map.current!);
    });
  }, [markers, areMarkersVisible]);

  useEffect(() => {
    prevMarkersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    if (!map.current) return;

    prevLinesRef.current?.forEach(({ lineId, lineSourceId, popup }) => {
      map.current?.removeLayer(lineId);
      map.current?.removeSource(lineSourceId);
      popup.remove();
    });

    lines.forEach(({ lineId, lineSource, lineLayer, lineSourceId, popup }) => {
      map.current?.addSource(lineSourceId, lineSource);
      map.current?.addLayer(lineLayer);
      map.current?.on('click', lineId, () => {
        popup.addTo(map.current!);
      });

      map.current?.on('mouseenter', lineId, () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current?.on('mouseleave', lineId, () => {
        map.current!.getCanvas().style.cursor = '';
      });

      map.current?.setLayoutProperty(
        lineId,
        'visibility',
        areLinesVisible ? 'visible' : 'none'
      );
    });
  }, [lines, areLinesVisible]);

  useEffect(() => {
    prevLinesRef.current = lines;
  }, [lines]);

  return (
    <>
      <Sidebar lng={lng} lat={lat} zoom={zoom} />
      <Controlbar
        appState={appState}
        setAppState={setAppState}
        areMarkersVisible={areMarkersVisible}
        setMarkersVisible={setMarkersVisible}
        markers={markers}
        areLinesVisible={areLinesVisible}
        setLinesVisible={setLinesVisible}
        lines={lines}
        setLines={setLines}
        setMarkers={setMarkers}
      />
      <MapContainer
        appState={appState}
        setAppState={setAppState}
        markers={markers}
        setMarkers={setMarkers}
        lines={lines}
        setLines={setLines}
        lng={lng}
        lat={lat}
        ref={mapContainer}
      />
    </>
  );
};

export default App;
