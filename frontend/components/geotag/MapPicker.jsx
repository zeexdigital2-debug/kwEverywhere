'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Navigation, Check, Loader2, Copy } from 'lucide-react';

// Custom crisp SVG Pin Icon that matches our theme and never fails on bundlers
const customPinIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="position:relative;width:32px;height:42px;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.35));cursor:grab;">
      <svg viewBox="0 0 24 32" width="32" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.372 0 0 5.372 0 12c0 9 12 20 12 20s12-11 12-20c0-6.628-5.372-12-12-12z" fill="#0a192f"/>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 7.8 10 17.5 10 17.5S22 19.8 22 12c0-5.523-4.477-10-10-10z" fill="#2563eb"/>
        <circle cx="12" cy="11" r="4.5" fill="#ffffff"/>
        <circle cx="12" cy="11" r="2" fill="#38bdf8"/>
      </svg>
    </div>
  `,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -40]
});

// Default fallback coordinate (Central London or general worldwide reference)
const DEFAULT_LAT = 51.5074;
const DEFAULT_LON = -0.1278;

export default function MapPicker({
  latitude,
  longitude,
  onChangeCoordinates,
  onApplyCoordinatesToAll,
  totalImagesCount
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Local text input states for Lat/Lon
  const [latInput, setLatInput] = useState(latitude !== null ? latitude.toString() : '');
  const [lonInput, setLonInput] = useState(longitude !== null ? longitude.toString() : '');
  const [inputError, setInputError] = useState('');

  // Nominatim Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);
  const lastRequestTimeRef = useRef(0);
  const abortControllerRef = useRef(null);

  // Sync inputs with incoming props when active image changes
  useEffect(() => {
    setLatInput(latitude !== null && latitude !== undefined ? latitude.toString() : '');
    setLonInput(longitude !== null && longitude !== undefined ? longitude.toString() : '');
    setInputError('');
  }, [latitude, longitude]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const initialLat = latitude !== null && latitude !== undefined ? latitude : DEFAULT_LAT;
    const initialLon = longitude !== null && longitude !== undefined ? longitude : DEFAULT_LON;
    const initialZoom = latitude !== null ? 14 : 3;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: true
    });

    // OpenStreetMap TileLayer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Marker
    const marker = L.marker([initialLat, initialLon], {
      draggable: true,
      icon: customPinIcon
    }).addTo(map);

    // Marker Drag event
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      const newLat = Number(pos.lat.toFixed(6));
      const newLon = Number(pos.lng.toFixed(6));
      setLatInput(newLat.toString());
      setLonInput(newLon.toString());
      onChangeCoordinates(newLat, newLon);
    });

    // Map Click event
    map.on('click', (e) => {
      const newLat = Number(e.latlng.lat.toFixed(6));
      const newLon = Number(e.latlng.lng.toFixed(6));
      marker.setLatLng([newLat, newLon]);
      setLatInput(newLat.toString());
      setLonInput(newLon.toString());
      onChangeCoordinates(newLat, newLon);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Handle initial resize
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker & map position when latitude/longitude props change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    if (latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude)) {
      const curLatLng = markerRef.current.getLatLng();
      if (Math.abs(curLatLng.lat - latitude) > 0.00001 || Math.abs(curLatLng.lng - longitude) > 0.00001) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapInstanceRef.current.panTo([latitude, longitude], { animate: true });
      }
    }
  }, [latitude, longitude]);

  // Handle Manual Lat/Lon typing with validation
  const handleCoordInputChange = (newLatStr, newLonStr) => {
    setLatInput(newLatStr);
    setLonInput(newLonStr);
    setInputError('');

    if (newLatStr.trim() === '' || newLonStr.trim() === '') {
      return;
    }

    const parsedLat = parseFloat(newLatStr);
    const parsedLon = parseFloat(newLonStr);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      setInputError('Coordinates must be valid numbers');
      return;
    }

    if (parsedLat < -90 || parsedLat > 90) {
      setInputError('Latitude must be between -90 and 90');
      return;
    }

    if (parsedLon < -180 || parsedLon > 180) {
      setInputError('Longitude must be between -180 and 180');
      return;
    }

    const validLat = Number(parsedLat.toFixed(6));
    const validLon = Number(parsedLon.toFixed(6));

    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([validLat, validLon]);
      mapInstanceRef.current.setView([validLat, validLon], Math.max(mapInstanceRef.current.getZoom(), 12));
    }
    onChangeCoordinates(validLat, validLon);
  };

  // Debounced Nominatim Geocoding API Search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    // 600ms debounce + max 1 request per second compliance
    searchTimeoutRef.current = setTimeout(async () => {
      const now = Date.now();
      const timeSinceLastReq = now - lastRequestTimeRef.current;
      if (timeSinceLastReq < 1000) {
        await new Promise((r) => setTimeout(r, 1000 - timeSinceLastReq));
      }
      lastRequestTimeRef.current = Date.now();

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
        const res = await fetch(url, {
          signal: abortControllerRef.current.signal,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Geocoding service error');
        const data = await res.json();
        setSearchResults(data || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Geocoding search failed:', err);
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 600);
  };

  const handleSelectSearchResult = (result) => {
    const lat = Number(parseFloat(result.lat).toFixed(6));
    const lon = Number(parseFloat(result.lon).toFixed(6));

    setLatInput(lat.toString());
    setLonInput(lon.toString());
    setSearchQuery(result.display_name.split(',')[0]);
    setShowDropdown(false);
    setInputError('');

    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([lat, lon]);
      mapInstanceRef.current.setView([lat, lon], 14, { animate: true });
    }

    onChangeCoordinates(lat, lon);
  };

  // Browser Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setInputError('Geolocation is not supported by your browser');
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsSearching(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lon = Number(pos.coords.longitude.toFixed(6));
        setLatInput(lat.toString());
        setLonInput(lon.toString());
        setInputError('');

        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([lat, lon]);
          mapInstanceRef.current.setView([lat, lon], 15, { animate: true });
        }
        onChangeCoordinates(lat, lon);
      },
      (err) => {
        setIsSearching(false);
        setInputError(`Could not obtain location: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Map & GPS Coordinates</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click map or drag the pin to set the exact photo location.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLocateMe}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          title="Detect my current location"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>My Location</span>
        </button>
      </div>

      {/* Nominatim Search Box */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search address, landmark, or city (e.g. Times Square, New York)..."
            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-blue-600 absolute right-3 top-3 animate-spin" />
          )}
        </div>

        {/* Dropdown Suggestions */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/70 transition-colors flex items-start space-x-2"
              >
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 line-clamp-2">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}

        {showDropdown && !isSearching && searchQuery.length >= 3 && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 text-center text-xs text-slate-500">
            No locations found. Try a different city or landmark name.
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200/90 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-72 sm:h-80 md:h-96" />
      </div>

      {/* Lat/Lon Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Latitude (-90 to 90)
          </label>
          <input
            type="number"
            step="any"
            value={latInput}
            onChange={(e) => handleCoordInputChange(e.target.value, lonInput)}
            placeholder="e.g. 40.712776"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Longitude (-180 to 180)
          </label>
          <input
            type="number"
            step="any"
            value={lonInput}
            onChange={(e) => handleCoordInputChange(latInput, e.target.value)}
            placeholder="e.g. -74.005974"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {inputError && (
        <p className="text-xs text-rose-600 font-medium">{inputError}</p>
      )}

      {/* Apply to all photos button */}
      {totalImagesCount > 1 && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Have multiple images from the same location?
          </span>
          <button
            type="button"
            onClick={onApplyCoordinatesToAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Apply to All {totalImagesCount} Photos</span>
          </button>
        </div>
      )}
    </div>
  );
}
