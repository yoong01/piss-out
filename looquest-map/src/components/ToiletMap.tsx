import { animate } from 'framer-motion';
import L from 'leaflet';
import { useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import type { Toilet } from '../data/types';
import 'leaflet/dist/leaflet.css';

const LONDON_CENTER: [number, number] = [51.5074, -0.1278];
const DEFAULT_ZOOM = 13;

const TIER_COLORS: Record<NonNullable<Toilet['tier']>, string> = {
  S: '#E8B923',
  A: '#4CAF7D',
  B: '#4A90D9',
  C: '#E8883A',
  D: '#D9534A',
};

const DISCOVERED_SIZE = 36;
const UNDISCOVERED_SIZE = 20;

function buildToiletIcon(toilet: Toilet): L.DivIcon {
  if (toilet.discovered) {
    const borderColor = toilet.tier ? TIER_COLORS[toilet.tier] : '#999999';
    return L.divIcon({
      className: 'toilet-div-icon',
      html: `<div style="
          width: ${DISCOVERED_SIZE}px;
          height: ${DISCOVERED_SIZE}px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid ${borderColor};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          cursor: pointer;
        ">🚽</div>`,
      iconSize: [DISCOVERED_SIZE, DISCOVERED_SIZE],
      iconAnchor: [DISCOVERED_SIZE / 2, DISCOVERED_SIZE / 2],
    });
  }

  return L.divIcon({
    className: 'toilet-div-icon',
    html: `<div style="
        width: ${UNDISCOVERED_SIZE}px;
        height: ${UNDISCOVERED_SIZE}px;
        border-radius: 9999px;
        background: rgba(120,120,120,0.35);
        border: 1px solid rgba(120,120,120,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        opacity: 0.65;
        cursor: pointer;
      ">🚽</div>`,
    iconSize: [UNDISCOVERED_SIZE, UNDISCOVERED_SIZE],
    iconAnchor: [UNDISCOVERED_SIZE / 2, UNDISCOVERED_SIZE / 2],
  });
}

interface ToiletMarkerProps {
  toilet: Toilet;
  onSelect: (toilet: Toilet) => void;
}

function ToiletMarker({ toilet, onSelect }: ToiletMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const icon = useMemo(() => buildToiletIcon(toilet), [toilet]);

  const handleClick = () => {
    const el = markerRef.current?.getElement();
    if (el) {
      animate(el, { scale: [1, 1.35, 0.9, 1] }, { duration: 0.4, ease: 'easeInOut' });
    }
    onSelect(toilet);
  };

  return (
    <Marker
      ref={markerRef}
      position={[toilet.lat, toilet.lng]}
      icon={icon}
      eventHandlers={{ click: handleClick }}
    />
  );
}

interface ToiletMapProps {
  toilets: Toilet[];
  onSelect: (toilet: Toilet) => void;
}

export function ToiletMap({ toilets, onSelect }: ToiletMapProps) {
  return (
    <MapContainer
      center={LONDON_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {toilets.map((toilet) => (
        <ToiletMarker key={toilet.id} toilet={toilet} onSelect={onSelect} />
      ))}
    </MapContainer>
  );
}
