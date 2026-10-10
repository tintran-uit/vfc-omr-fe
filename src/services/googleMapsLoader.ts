type GoogleLatLng = {
  lat: () => number;
  lng: () => number;
};

export type GoogleLatLngBounds = {
  getSouthWest: () => GoogleLatLng;
  getNorthEast: () => GoogleLatLng;
};

export type GoogleMapInstance = {
  addListener: (event: string, handler: (event?: { latLng?: GoogleLatLng }) => void) => void;
  setCenter: (position: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  getBounds: () => GoogleLatLngBounds | null | undefined;
  fitBounds: (bounds: GoogleLatLngBounds) => void;
};

export type GoogleMarkerInstance = {
  setPosition: (position: { lat: number; lng: number }) => void;
  getPosition: () => GoogleLatLng | null | undefined;
  addListener: (event: string, handler: () => void) => void;
  setMap: (map: GoogleMapInstance | null) => void;
  setIcon: (icon: Record<string, unknown>) => void;
  setZIndex: (zIndex: number) => void;
};

export type GoogleInfoWindow = {
  setContent: (content: string | HTMLElement) => void;
  open: (options: { map: GoogleMapInstance; anchor?: GoogleMarkerInstance }) => void;
  close: () => void;
};

type GoogleMapsNamespace = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMapInstance;
  Marker: new (options: Record<string, unknown>) => GoogleMarkerInstance;
  InfoWindow: new (options?: Record<string, unknown>) => GoogleInfoWindow;
  LatLngBounds: new () => GoogleLatLngBounds;
  SymbolPath: { CIRCLE: number };
  OverlayView: new () => {
    setMap: (map: GoogleMapInstance | null) => void;
    getProjection: () => {
      fromLatLngToContainerPixel: (position: GoogleLatLng) => { x: number; y: number } | null;
    } | null;
    onAdd: () => void;
    draw: () => void;
    onRemove: () => void;
  };
  Geocoder: new () => {
    geocode: (
      request: { address: string },
      callback: (
        results: Array<{
          geometry: {
            location: GoogleLatLng;
            viewport?: GoogleLatLngBounds;
          };
        }> | null,
        status: string,
      ) => void,
    ) => void;
  };
  event: {
    addListenerOnce: (instance: object, eventName: string, handler: () => void) => void;
    clearInstanceListeners: (instance: object) => void;
  };
};

declare global {
  interface Window {
    google?: { maps: GoogleMapsNamespace };
  }
}

let loader: Promise<void> | null = null;

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (window.google?.maps) return Promise.resolve();
  if (!apiKey) return Promise.reject(new Error("Missing Google Maps API key"));

  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loader = null;
        reject(new Error("Failed to load Google Maps"));
      };
      document.head.appendChild(script);
    });
  }

  return loader;
}
