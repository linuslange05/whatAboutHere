import './style.css';
import {fromLonLat, transform} from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import {getBottomLeft, getHeight, getWidth} from 'ol/extent.js';
import {toContext} from 'ol/render.js';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { Circle, Point } from 'ol/geom';
import OpenAI from "openai"


const openai = new OpenAI({project: "proj_CBN2iDPQRzvJIz7VrLmjk1TG", apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true});


async function chatgptCountryFact(countryName) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert on the culture of " + countryName + "."},
      {role: "user", content: 'Give me one interesting/funny/amusing/mind-blowing fact about the country '+ countryName + '. Use 2 sentences and at most 40 words, Start the first sentence with "Did you know, that"'}
  ],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0]['message']['content']
}

var languageCodes = {
  "aa": "Afar",
  "ab": "Abkhazian",
  "ae": "Avestan",
  "af": "Afrikaans",
  "ak": "Akan",
  "am": "Amharic",
  "an": "Aragonese",
  "ar": "Arabic",
  "as": "Assamese",
  "av": "Avaric",
  "ay": "Aymara",
  "az": "Azerbaijani",
  "ba": "Bashkir",
  "be": "Belarusian",
  "bg": "Bulgarian",
  "bh": "Bihari languages",
  "bi": "Bislama",
  "bm": "Bambara",
  "bn": "Bengali",
  "bo": "Tibetan",
  "br": "Breton",
  "bs": "Bosnian",
  "ca": "Catalan; Valencian",
  "ce": "Chechen",
  "ch": "Chamorro",
  "co": "Corsican",
  "cr": "Cree",
  "cs": "Czech",
  "cu": "Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic",
  "cv": "Chuvash",
  "cy": "Welsh",
  "da": "Danish",
  "de": "German",
  "dv": "Divehi; Dhivehi; Maldivian",
  "dz": "Dzongkha",
  "ee": "Ewe",
  "el": "Greek, Modern (1453-)",
  "en": "English",
  "eo": "Esperanto",
  "es": "Spanish; Castilian",
  "et": "Estonian",
  "eu": "Basque",
  "fa": "Persian",
  "ff": "Fulah",
  "fi": "Finnish",
  "fj": "Fijian",
  "fo": "Faroese",
  "fr": "French",
  "fy": "Western Frisian",
  "ga": "Irish",
  "gd": "Gaelic; Scomttish Gaelic",
  "gl": "Galician",
  "gn": "Guarani",
  "gu": "Gujarati",
  "gv": "Manx",
  "ha": "Hausa",
  "he": "Hebrew",
  "hi": "Hindi",
  "ho": "Hiri Motu",
  "hr": "Croatian",
  "ht": "Haitian; Haitian Creole",
  "hu": "Hungarian",
  "hy": "Armenian",
  "hz": "Herero",
  "ia": "Interlingua (International Auxiliary Language Association)",
  "id": "Indonesian",
  "ie": "Interlingue; Occidental",
  "ig": "Igbo",
  "ii": "Sichuan Yi; Nuosu",
  "ik": "Inupiaq",
  "io": "Ido",
  "is": "Icelandic",
  "it": "Italian",
  "iu": "Inuktitut",
  "ja": "Japanese",
  "jv": "Javanese",
  "ka": "Georgian",
  "kg": "Kongo",
  "ki": "Kikuyu; Gikuyu",
  "kj": "Kuanyama; Kwanyama",
  "kk": "Kazakh",
  "kl": "Kalaallisut; Greenlandic",
  "km": "Central Khmer",
  "kn": "Kannada",
  "ko": "Korean",
  "kr": "Kanuri",
  "ks": "Kashmiri",
  "ku": "Kurdish",
  "kv": "Komi",
  "kw": "Cornish",
  "ky": "Kirghiz; Kyrgyz",
  "la": "Latin",
  "lb": "Luxembourgish; Letzeburgesch",
  "lg": "Ganda",
  "li": "Limburgan; Limburger; Limburgish",
  "ln": "Lingala",
  "lo": "Lao",
  "lt": "Lithuanian",
  "lu": "Luba-Katanga",
  "lv": "Latvian",
  "mg": "Malagasy",
  "mh": "Marshallese",
  "mi": "Maori",
  "mk": "Macedonian",
  "ml": "Malayalam",
  "mn": "Mongolian",
  "mr": "Marathi",
  "ms": "Malay",
  "mt": "Maltese",
  "my": "Burmese",
  "na": "Nauru",
  "nb": "Bokmål, Norwegian; Norwegian Bokmål",
  "nd": "Ndebele, North; North Ndebele",
  "ne": "Nepali",
  "ng": "Ndonga",
  "nl": "Dutch; Flemish",
  "nn": "Norwegian Nynorsk; Nynorsk, Norwegian",
  "no": "Norwegian",
  "nr": "Ndebele, South; South Ndebele",
  "nv": "Navajo; Navaho",
  "ny": "Chichewa; Chewa; Nyanja",
  "oc": "Occitan (post 1500)",
  "oj": "Ojibwa",
  "om": "Oromo",
  "or": "Oriya",
  "os": "Ossetian; Ossetic",
  "pa": "Panjabi; Punjabi",
  "pi": "Pali",
  "pl": "Polish",
  "ps": "Pushto; Pashto",
  "pt": "Portuguese",
  "qu": "Quechua",
  "rm": "Romansh",
  "rn": "Rundi",
  "ro": "Romanian; Moldavian; Moldovan",
  "ru": "Russian",
  "rw": "Kinyarwanda",
  "sa": "Sanskrit",
  "sc": "Sardinian",
  "sd": "Sindhi",
  "se": "Northern Sami",
  "sg": "Sango",
  "si": "Sinhala; Sinhalese",
  "sk": "Slovak",
  "sl": "Slovenian",
  "sm": "Samoan",
  "sn": "Shona",
  "so": "Somali",
  "sq": "Albanian",
  "sr": "Serbian",
  "ss": "Swati",
  "st": "Sotho, Southern",
  "su": "Sundanese",
  "sv": "Swedish",
  "sw": "Swahili",
  "ta": "Tamil",
  "te": "Telugu",
  "tg": "Tajik",
  "th": "Thai",
  "ti": "Tigrinya",
  "tk": "Turkmen",
  "tl": "Tagalog",
  "tn": "Tswana",
  "to": "Tonga (Tonga Islands)",
  "tr": "Turkish",
  "ts": "Tsonga",
  "tt": "Tatar",
  "tw": "Twi",
  "ty": "Tahitian",
  "ug": "Uighur; Uyghur",
  "uk": "Ukrainian",
  "ur": "Urdu",
  "uz": "Uzbek",
  "ve": "Venda",
  "vi": "Vietnamese",
  "vo": "Volapük",
  "wa": "Walloon",
  "wo": "Wolof",
  "xh": "Xhosa",
  "yi": "Yiddish",
  "yo": "Yoruba",
  "za": "Zhuang; Chuang",
  "zh": "Chinese",
  "zu": "Zulu"
}
var countryFacts = {}
var duolingoLanguages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Dutch", "Japanese", "Czech", "Danish", "Greek", "Finnish", "Irish", "Hebrew", "Hindi", "Hungarian", "Indonesian", "Korean", "Norwegian", "Polish", "Romanian", "Russian", "Swedish", "Swahili", "Turkish", "Ukranian", "Vietnamese", "Chinese"]

var promises = []
const scheme = new ColorScheme()
const random_r = Math.floor(Math.random() * (221 - 32)) + 32
const random_g = Math.floor(Math.random() * (221 - 32)) + 32
const random_b = Math.floor(Math.random() * (221 - 32)) + 32
const randomHexCode = parseInt(random_r, 10).toString(16) + parseInt(random_g, 10).toString(16) + parseInt(random_b, 10).toString(16)
var countryFaktCount = 0

scheme.from_hex(randomHexCode).scheme("analogic")
const colors = scheme.colors().map(color => '#' + color)
document.querySelector("#map").setAttribute("style", "background: "+colors[2])
document.querySelector("body").setAttribute("style", "background: "+colors[2])
const container = document.querySelector('#popup-container')
const content  = document.querySelector('#popup-content')
const closer  = document.querySelector('#popup-closer')
container.setAttribute("style", "background: "+colors[6]+";border: 1vh solid "+colors[5])
closer.setAttribute("style", "color:"+colors[5])


var markerVectorSource = new VectorSource()
var capitalMarkerVectorSource = new VectorSource()
let userPosition = [0,0]
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((pos)=> {
    const userPos = [pos.coords.longitude, pos.coords.latitude]
    const userPosFeature =  new Feature({
      geometry: new Point(fromLonLat(userPos))
    })
    markerVectorSource.addFeature(userPosFeature)
    map.addLayer(new VectorLayer({
      source: markerVectorSource
    }))
  
    view.setCenter(transform(userPos, 'EPSG:4326', 'EPSG:3857'))
    view.setZoom(4.5)
  });
}

const defaultStroke = new Stroke({
  color: colors[3],
   width: 3,
});
const defaultFill = new Fill({
  color: colors[0]
});
const selectedStroke = new Stroke({
  color: '#ffffff',
  width: 5,
});
const defaultStyle = new Style({
  fill: defaultFill,
  stroke: defaultStroke
})

const selectedStyle = new Style({
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
    renderContext.setFillStrokeStyle(defaultFill, selectedStroke);
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
  style: defaultStyle
});

var countryFaktText = "EOL"


const countryName = document.querySelector("#name")
const countryFlag = document.querySelector("#flag-emoji")
const countryHauptstadt = document.querySelector("#hauptstadt")
const countrySprache = document.querySelector("#sprache")
const countrySpracheLink = document.querySelector("#sprache-link")
const countryWaehrung = document.querySelector("#waehrung")
const countryKontinent = document.querySelector("#kontient")
const countryFlightsLink = document.querySelector("#flights-link")
var countryFakt = document.querySelector("#fakt")
const links = document.querySelectorAll("a")
  for (let index = 1; index < links.length; index++) {
    links[index].style.color = colors[1]
    links[index].style.fontWeight ="bold"
    
  }
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});



closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  currentCountry.setStyle(defaultStyle)
  currentCountry = dummyFeature
  markerVectorSource.removeFeature(capitalPosFeature) 
  map.removeLayer(capitalMarkerVectorLayer)
  return false;
};


var clicks = 0
const view = new View({
  center: userPosition,
  zoom: 3,
  extent: [-20000000,-20000000, 20000000, 20000000],
})
const map = new Map({
  layers: [vectorLayer],
  target: 'map',
  view: view,
  overlays: [overlay],
});
const dummyFeature = new Feature()
var currentCountry = dummyFeature
let currentCountryData = {}
var capitalPosFeature = dummyFeature
capitalMarkerVectorSource.addFeature(capitalPosFeature)
var capitalMarkerVectorLayer = new VectorLayer({source: capitalMarkerVectorSource})
map.on('click', function(e){
  markerVectorSource.removeFeature(capitalPosFeature) 
  map.removeLayer(capitalMarkerVectorLayer)
  clicks++;
  if(clicks > 10) {vectorLayer.getSource().changed();clicks = 0}
  map.forEachFeatureAtPixel(e.pixel, async function(feature, layer){
    if(feature == capitalPosFeature){
      window.open("https://www.google.com/maps/place/" + currentCountryData['capital'][0] + "/@" + currentCountryData['capitalInfo']['latlng'][0] + "," + currentCountryData['capitalInfo']['latlng'][1] + "8z", "_blank")

    }else{
      if(feature != currentCountry){ 

    currentCountry.setStyle(defaultStyle)
    currentCountry = feature
    feature.setStyle(selectedStyle)
    const img = new Image();
    img.crossOrigin = "Anonymous";
  img.onload = function () {
    feature.set('flag', img);
  };
  img.src =
    'https://flagcdn.com/w320/' + feature.get('iso_a2').toLowerCase() + '.png';
  const url = "https://restcountries.com/v3.1/alpha/" + feature.get('iso_a2')
  const res = await fetch(url,{method: "GET", headers:{
    'Accept': 'application/json'
  }})
  const data = await res.json()
  currentCountryData = data[0]
  const point = new Point(fromLonLat([currentCountryData['capitalInfo']['latlng'][1], currentCountryData['capitalInfo']['latlng'][0]]))
  style: new Style({
    fill: new Fill({
      color: '#000000'
    }),
    stroke: new Stroke({
      color: '#000000',
      width: 2
    }),
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: '#000000'
      })
    })
  })
  capitalPosFeature = new Feature({
    geometry: point
})
  markerVectorSource.addFeature(capitalPosFeature)
  capitalMarkerVectorLayer.setSource(capitalMarkerVectorSource)
  map.addLayer(capitalMarkerVectorLayer)
  countryName.textContent = feature.get('name')
  countryHauptstadt.textContent = currentCountryData['capital'][0]
  countryHauptstadt.setAttribute("href", "https://en.wikipedia.org/wiki/" + currentCountryData['capital'][0])
  if(duolingoLanguages.includes(currentCountryData['languages'][Object.keys(currentCountryData['languages'])[0]])){
    countrySprache.setAttribute("style", "display: none;")
    countrySpracheLink.textContent = currentCountryData['languages'][Object.keys(currentCountryData['languages'])[0]]
    countrySpracheLink.setAttribute("href", "https://www.duolingo.com/course/" + Object.keys(languageCodes).find(key => languageCodes[key] === currentCountryData['languages'][Object.keys(currentCountryData['languages'])[0]]) + "/en/Learn-" + currentCountryData['languages'][Object.keys(currentCountryData['languages'])[0]])
    countrySpracheLink.style.display = "initial"
  }else{
    countrySpracheLink.setAttribute("style", "display: none;  text-decoration: none;")
    countrySprache.textContent = currentCountryData['languages'][Object.keys(currentCountryData['languages'])[0]]
    countrySprache.setAttribute("style", "display: initial;  text-decoration: none;")

  }
  countryWaehrung.textContent = currentCountryData['currencies'][Object.keys(currentCountryData['currencies'])[0]]['name'] + " (" + currentCountryData['currencies'][Object.keys(currentCountryData['currencies'])[0]]['symbol'] + ")"
  countryKontinent.textContent = currentCountryData['continents'][0]
  countryFlag.textContent = getFlagEmoji(feature.get("iso_a2"))
  countryFlightsLink.textContent = "Flights to " + feature.get("name")
  countryFlightsLink.setAttribute("href", "https://www.google.com/travel/flights/flights-to-" + feature.get("name").toLowerCase() + ".html")  
  countryFakt.textContent = ''
  // document.querySelector("#fakt-wrapper").removeChild(countryFakt)
  countryFakt = document.createElement("p")
  countryFakt.id = "fakt" + countryFaktCount++
  document.querySelector("#fakt-wrapper").appendChild(countryFakt)
  overlay.setPosition(transform([currentCountryData['capitalInfo']['latlng'][1],currentCountryData['capitalInfo']['latlng'][0]], 'EPSG:4326', 'EPSG:3857'))
      if(feature.get("name") in countryFacts){
        countryFaktText = countryFacts[feature.get("name")]
        for (let index = 0; index < countryFaktText.length; index++) {
          countryFakt.textContent += countryFaktText[index]
          if(countryFaktText[index] == " "){
            await sleep(Math.random() * 50 + 75)
          }else if(countryFaktText[index] == "." || countryFaktText[index] == "?" || countryFaktText[index] == "!"){
            await sleep(650)
          }else{
            await sleep(Math.random() * 50 + 50)
          }
        } 
        }else{
          countryFaktText = await chatgptCountryFact(feature.get("name"))
          for (let index = 0; index < countryFaktText.length; index++) {
            countryFakt.textContent += countryFaktText[index]
            if(countryFaktText[index] == " "){
              await sleep(Math.random() * 50 + 75)
            }else if(countryFaktText[index] == "." || countryFaktText[index] == "?" || countryFaktText[index] == "!"){
              await sleep(650)
            }else{
              await sleep(Math.random() * 50 + 50)
            }
            
        }
        
      }
}}})
})
function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
map.on('pointermove', function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  const overlayPos = map.getPixelFromCoordinate(overlay.getPosition() || [0,0])
  const mouseInOverlay = ((pixel[0] >= overlayPos[0] && pixel[0] <= overlayPos[0] + (container.offsetWidth || -Infinity)) &&(pixel[1] >= overlayPos[1] && pixel[1] <= overlayPos[1] + (container.offsetHeight || -Infinity)))
  if (hit){
    if(mouseInOverlay){
    document.querySelector('#map').style.cursor = '';
    }else{
      document.querySelector('#map').style.cursor = 'url("imgs/marker.svg"), auto';
      map.forEachFeatureAtPixel(e.pixel, async function(feature, layer){
        if(feature == capitalPosFeature){
          document.querySelector("#map").style.cursor = 'pointer'
        }})
    }
  }else{
    document.querySelector("#map").style.cursor = 'pointer'
  }
});
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const heading = document.querySelector("h1")

map.on("loadend", async function(e){
  await sleep(100)
  heading.textContent = " "
  const str1 = "What about Germany?" 
  const substr1 = "Germany?"
  const str2 = "Benin?"
  const str3 = "WhatAboutHere?"
  for (let index = 0; index < str1.length+2+str2.length+2+str3.length-1; index++) {
    await sleep(Math.random() * 100 + 100)
    if((index % 3) == 0){
      if(index <= str1.length + 2 + str2.length + 1){
        heading.setAttribute("style", "border-right: 0.4vh solid #000000;")
      }else{
        heading.setAttribute("style", "border-right: 0.4vh solid #000000; color: " + colors[0])
      }
      await sleep(Math.random() * 125)
    }else{
      heading.setAttribute("style", "border: " + "none;")
    }
    if(index < str1.length){
      if(index >10 && index != str1.length - 1){
        if(index < 14){
          heading.innerHTML += '<span style="color: #404040;">' + str1[index] + '</span>'
        }else if(index < 16){
          heading.innerHTML += '<span style="color: #e00000;">' + str1[index] + '</span>'
        }else{
          heading.innerHTML += '<span style="color: #f0f000;">' + str1[index] + '</span>'
        }
      }else{
        heading.innerHTML += str1[index]
      }
    }else if(index == str1.length){
      await sleep(750)
  }else if(index == str1.length + 1){
      for (let jndex = 0; jndex < substr1.length; jndex++) {
        heading.textContent = heading.textContent.slice(0, -1)
        await sleep(50)
      }
    }else if (index < str1.length + 2 + str2.length){
      if(index < 23){
        heading.innerHTML += '<span style="color: #00e000;">' + str2[index - (str1.length+2)] + '</span>'
      }else if(index < 26){
        heading.innerHTML += '<span class="half" cont="' + str2[index - (str1.length+2)] + '" style="color: #e00000;">' + str2[index - (str1.length+2)] + '</span>'
      }else{
        heading.innerHTML += str2[index - (str1.length+2)]
      }
    }else if(index == str1.length + 2 + str2.length){
      await sleep(500)
    }else if(index == str1.length + 2 + str2.length + 1){
      for (let jndex = 0; jndex < str1.length - substr1.length + str2.length - 1; jndex++) {
        heading.textContent = heading.textContent.slice(0, -1)
        await sleep(50)
      }
    }else{
      heading.textContent += str3[index - (str1.length+2+str2.length+2)+1]
      heading.setAttribute("style", "color: " + colors[0])
    }

  }
})