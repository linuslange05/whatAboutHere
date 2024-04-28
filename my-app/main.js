import './style.css';
import TileLayer from 'ol/layer/Tile';
import { Vector } from 'ol/source';
import OSM from 'ol/source/OSM';
import {transform} from 'ol/proj'
import ZoomSlider from 'ol/control/ZoomSlider.js';
import {defaults as defaultControls} from 'ol/control.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import {getBottomLeft, getHeight, getWidth} from 'ol/extent.js';
import {toContext} from 'ol/render.js';
import { createDefaultStyle } from 'ol/style/Style'
import Feature from 'ol/Feature';

// vectorLayer.getSource().on('addfeature', function (event) {
//   const feature = event.feature;
//   const img = new Image();
//   img.onload = function () {
//     feature.set('flag', img);
//   };
//   img.src =
//     'https://flagcdn.com/w320/' + feature.get('iso_a2').toLowerCase() + '.png';
// });
// const geojson = require('world-geojson')


// const map = new Map({
//   target: 'map',
//   layers: [
//     vectorLayer,
//   ],
//   view: new View({
//     center: [0, 0],
//     zoom: 1,
//     maxZoom: 9,
//     extent: [-20000000,-20000000, 20000000, 20000000],
//     // constrainOnlyCenter: true
//   }),
//   controls: defaultControls().extend([new ZoomSlider()]),
// });

// const vectorLayer = new VectorLayer({
//   source: new VectorSource({
//     format: new GeoJSON(),
//     url: 'https://openlayersbook.github.io/openlayers_book_samples/assets/data/countries.geojson'
//     // url: 'data/world-administrative-boundaries.geojson'
//   }),
  
// })

// // Klickereignis auf der OpenLayers-Karte einfangen
// map.on('click', function(event) {
//   var coordinate = event.coordinate;
//   console.log(coordinate)
  
//   // Koordinaten von der verwendeten Projektion (z.B. EPSG:3857) in die WGS84-Projektion (EPSG:4326) transformieren
//   var wgs84Coordinate = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
  
//   // URL für die Nominatim Geocodierungsdienst-API zusammenstellen
//   var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + wgs84Coordinate[1] + '&lon=' + wgs84Coordinate[0] + '&zoom=18&addressdetails=1&accept-language=en';

//   // Anfrage an die Nominatim API senden
//   fetch(url)
//       .then(response => response.json())
//       .then(data => {
//           // Antwort verarbeiten und das Land extrahieren
//           var country = data.address.country;
//           if (country) {
//               alert("Land: " + country);
//               alert(geojson.forCountry(country))
//               map.addLayer()
//           } else {
//               alert('Das Land konnte nicht aus den Geocodierungsinformationen extrahiert werden.');
//           }
//       })
//       .catch(error => {
//           alert('Fehler beim Abrufen der Geocodierungsinformationen:', error);
//       });
  
// });




const fill = new Fill()
const defaultStroke = new Stroke({
  color: '#3399CC',
   width: 1.25,
});
const defaultFill = new Fill({
  color: 'rgba(255,255,255,0.4)'
});
const stroke = new Stroke({
  color: 'rgba(255,255,255,0.8)',
  width: 2,
});
const defaultStyle = new Style({
  fill: defaultFill,
  stroke: defaultStroke
})
const style = new Style({
  renderer: function (pixelCoordinates, state) {
    const context = state.context;
    const geometry = state.geometry.clone();
    geometry.setCoordinates(pixelCoordinates);
    const extent = geometry.getExtent();
    const width = getWidth(extent);
    const height = getHeight(extent);
    const flag = state.feature.get('flag');
    if (!flag || height < 1 || width < 1) {
      return;
    }

    // Stitch out country shape from the blue canvas
    context.save();
    const renderContext = toContext(context, {
      pixelRatio: 1,
    });
    renderContext.setFillStrokeStyle(fill, stroke);
    renderContext.drawGeometry(geometry);
    context.clip();

    // Fill transparent country with the flag image
    const bottomLeft = getBottomLeft(extent);
    const left = bottomLeft[0];
    const bottom = bottomLeft[1];
    context.drawImage(flag, left, bottom, width, height);
    context.restore();
  },
});

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    url: 'https://openlayersbook.github.io/openlayers_book_samples/assets/data/countries.geojson',
    format: new GeoJSON(),
  }),
  // style: style,
});

// Load country flags and set them as `flag` attribute on the country feature
// vectorLayer.getSource().on('addfeature', function (event) {
//   const feature = event.feature;
//   const img = new Image();
//   img.onload = function () {
//     feature.set('flag', img);
//   };
//   img.src =
//     'https://flagcdn.com/w320/' + feature.get('iso_a2').toLowerCase() + '.png';
// });

const map = new Map({
  layers: [vectorLayer],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 1,
    extent: [-20000000,-20000000, 20000000, 20000000],
  }),
});

var currentCountry = new Feature()

map.on('click', function(e){
  map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
    currentCountry.setStyle(defaultStyle)
    currentCountry = feature
    console.log(feature);
    console.log(layer);
    feature.setStyle(style)
    const img = new Image();
    img.crossOrigin = "Anonymous";
  img.onload = function () {
    feature.set('flag', img);
  };
  img.src =
    'https://flagcdn.com/w320/' + feature.get('iso_a2').toLowerCase() + '.png';
  })})