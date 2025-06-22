import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, {
  GeoJSONSource,
  Map,
  MapLayerMouseEvent,
  Marker,
} from 'mapbox-gl';
import { Sidebar } from './Sidebar';
import { Controlbar } from './Controlbar';
import { MapContainer } from './MapContainer';
import { Line, AppState, AppStates } from '../helpers/types';
import { mapStyle } from '../helpers/data';
import {
  DEFAULT_LAT,
  DEFAULT_LNG,
  DEFAULT_ZOOM,
  LINES_LAYER_ID,
  LINES_LAYER_SOURCE_ID,
} from '../const';

const App = ({ isTesting }: { isTesting: boolean }): JSX.Element => {
  const [appState, setAppState] = useState<AppState>(AppStates.SURFING);

  const [lng, setLng] = useState<number>(DEFAULT_LNG);
  const [lat, setLat] = useState<number>(DEFAULT_LAT);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);

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
      testMode: isTesting,
    });

    map.current.on('mousemove', ({ lngLat }) => {
      setLng(Number(lngLat.lng.toFixed(4)));
      setLat(Number(lngLat.lat.toFixed(4)));
    });

    map.current.on('move', () => {
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });

    map.current.on('load', () => {
      map.current?.addSource(LINES_LAYER_SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.current?.addLayer({
        id: LINES_LAYER_ID,
        source: LINES_LAYER_SOURCE_ID,
        type: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 8,
        },
      });

      map.current?.on('mouseenter', LINES_LAYER_ID, () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current?.on('mouseleave', LINES_LAYER_ID, () => {
        map.current!.getCanvas().style.cursor = '';
      });
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
    if (!map.current || !map.current.loaded()) return;

    prevLinesRef.current?.forEach(({ popup }) => {
      popup.remove();
    });

    const newLineFeatures = lines.map(({ lineData }) => lineData);
    const lineSource = map.current.getSource(
      LINES_LAYER_SOURCE_ID,
    ) as GeoJSONSource;

    lineSource?.setData({
      type: 'FeatureCollection',
      features: newLineFeatures,
    });

    const handleLineClick = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      const title = feature?.properties?.title;
      if (!title) return;

      const popup = lines.find((line) => line.lineId === title)?.popup;
      popup?.addTo(map.current!);
    };
    map.current?.on('click', LINES_LAYER_ID, handleLineClick);

    map.current?.setLayoutProperty(
      LINES_LAYER_ID,
      'visibility',
      areLinesVisible ? 'visible' : 'none',
    );

    return () => {
      map.current?.off('click', LINES_LAYER_ID, handleLineClick);
    };
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
