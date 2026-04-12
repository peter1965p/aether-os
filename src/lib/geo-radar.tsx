"use client";

import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore
import Globe from 'react-globe.gl';

export default function GeoRadarGlobe() {
  // FIX: useRef benötigt einen Initialwert (null) und wir definieren den Typ als 'any', 
  // da Globe.gl keine nativen TS-Typen für die Instanz mitliefert
  const globeEl = useRef<any>(null);
  
  const [arcsData] = useState([
    { startLat: 51.1657, startLng: 10.4515, endLat: 49.6116, endLng: 6.1319, color: '#0070f3' },
    { startLat: 51.1657, startLng: 10.4515, endLat: 34.0522, endLng: -118.2437, color: '#0070f3' }
  ]);

  const masterNode = [{ lat: 51.1657, lng: 10.4515, size: 20, color: '#0070f3' }];

  useEffect(() => {
    const globe = globeEl.current;
    
    // FIX: Da globeEl mit null initialisiert wird, müssen wir prüfen, ob die Instanz existiert
    if (globe) {
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;

      globe.controls().minDistance = 200;
      globe.controls().maxDistance = 500;
      
      globe.pointOfView({ lat: 40, lng: 10, altitude: 2.5 }, 0);
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <Globe
        ref={globeEl}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#0070f3"
        atmosphereAltitude={0.15}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

        pointsData={masterNode}
        pointColor="color"
        pointAltitude={0.05}
        pointRadius="size"
        pointsMerge={true}
        
        arcsData={arcsData}
        arcColor="color"
        arcAltitude={0.1}
        arcStroke={0.5}
        arcDashLength={0.9}
        arcDashGap={4}
        arcDashAnimateTime={1000}
        
        // FIX: Typ 'any' für den Parameter 'arc' vergeben, um Fehler 7006 zu lösen
        onArcClick={(arc: any) => {
          alert(`TRAFFIC INTERCEPT: Path triggered from ${arc.startLat}/${arc.startLng}`);
        }}
      />
      
      <div className="absolute top-2 right-2 p-2 bg-black/50 border border-blue-500/20 rounded font-mono text-[8px] uppercase tracking-tighter text-slate-500">
         Region: NRW / Germany detected
      </div>
    </div>
  );
}