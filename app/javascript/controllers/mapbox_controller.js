import { Controller } from "@hotwired/stimulus";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;

    this.map = new mapboxgl.Map({
      container: this.element,
      style: 'mapbox://styles/bluep9/ckw3bkz0t0ydf15o4p3c7vfgw'
    });

    this._addMarkersToMap();
    this._fitMapToMarkers();

    this.map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );
  }

  _addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      // Create a popup using the embedded HTML (info window)
      const popup = new mapboxgl.Popup().setHTML(marker.info_window);

      // Create a HTML element for your custom marker
      const customMarker = document.createElement('div');
      customMarker.className = 'marker';
      customMarker.style.backgroundImage = `url('${marker.image_url}')`;
      customMarker.style.backgroundSize = 'contain';
      customMarker.style.width = '25px';
      customMarker.style.height = '25px';

      new mapboxgl.Marker(customMarker)
        .setLngLat([ marker.lng, marker.lat ])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  _fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]));
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
  }
}
