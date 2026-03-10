// src/components/MapComponent.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

const MapComponent = ({ 
  center = [28.6139, 77.2090], 
  zoom = 12,
  markers = [],
  riskZones = [],
  showTourists = true,
  onMarkerClick 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add risk zones
    riskZones.forEach(zone => {
      if (zone.coordinates && zone.coordinates.length === 2) {
        const rectangle = L.rectangle(zone.coordinates, {
          color: zone.riskLevel === 'high' ? '#ef4444' : 
                 zone.riskLevel === 'moderate' ? '#f59e0b' : '#10b981',
          weight: 2,
          fillOpacity: 0.2
        }).addTo(mapInstanceRef.current);
        
        rectangle.bindPopup(`
          <strong>${zone.name}</strong><br>
          Risk Level: ${zone.riskLevel}<br>
          ${zone.description}
        `);
        
        markersRef.current.push(rectangle);
      }
    });

    // Add tourist markers
    if (showTourists) {
      markers.forEach(marker => {
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-pulse ${marker.status || 'safe'}" style="background: ${marker.color || '#2563eb'}">
                  <span>${marker.icon || '👤'}</span>
                 </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const leafletMarker = L.marker(marker.position, { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <strong>${marker.name || 'Tourist'}</strong><br>
            Status: ${marker.status || 'Active'}<br>
            Safety Score: ${marker.safetyScore || 'N/A'}
          `);

        if (onMarkerClick) {
          leafletMarker.on('click', () => onMarkerClick(marker));
        }

        markersRef.current.push(leafletMarker);
      });
    }
  }, [markers, riskZones, showTourists, onMarkerClick]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return <div ref={mapRef} className="map-container" />;
};

export default MapComponent;