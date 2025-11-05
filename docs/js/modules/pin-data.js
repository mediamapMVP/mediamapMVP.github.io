// Module for pulling pin data into map

const CREATE_MAP_MODULE = await import("./create-map.js");

const JEKYLL_VARIABLES = await import("./jekyll-liquid-templates.js");

const BOTTOM_BAR_MODULE = await import("./bottom-bar.js");


// Tab delimiter
async function tsvToArray(fileName, delimiter = "	") {
  // Pull pin data from local file
  let tsvString = await fetch(fileName)
    .then(res => res.text())
    .then(data => { return (data); });
  let rows = tsvString.split("\n");

  // Split each row into cells
  let splitRows = rows.map(row => row.split(delimiter));

  // Remove the column names row
  splitRows.splice(0, 1);
  return (splitRows);
}


// Setup pin design
const ColorIcon = L.Icon.extend({
  options: {
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    shadowSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }
});

let blackIcon = new ColorIcon({ iconUrl: "/images/map-marker.svg" });
let featuredIcon = new ColorIcon({ iconUrl: "/images/featured-map-marker.svg" });

const MAP = CREATE_MAP_MODULE.getOrCreateMap();

function createPinMarker(pin) {
  let pinIcon;
  if (JEKYLL_VARIABLES.FEATURED_NAMES.has(pin.name))
    pinIcon = featuredIcon;
  else
    pinIcon = blackIcon;

  pin.marker = L.marker([pin.location.lat, pin.location.lng], { icon: pinIcon }).addTo(MAP);

  return pin;
}

const SAMPLE_IMG_URL = JEKYLL_VARIABLES.SAMPLE_IMG_URL;

function pinHTMLTemplate(pin, idSuffix, mediaType, pinHeader) {
  let imgName = pin.id.split(idSuffix)[0] + `-${mediaType}.png`;
  let imgUrl = `/images/media/${mediaType}/${pin.name}/${imgName}`;

  if (!(JEKYLL_VARIABLES.IMAGE_FILES.includes(imgUrl)))
    imgUrl = SAMPLE_IMG_URL;

  let pinAddress = pin.location_address;
  if (pin.filming_location)
    pinAddress = pin.filming_location + ", " + pinAddress;

  return `
			<div class="row align-items-stretch" style="min-height: 7.5rem;">
				<div class="col-5 d-flex justify-content-center">
					<img src="${imgUrl}" title="${pin.name}" alt="${pin.name}" width=100% style="object-fit: contain;">
				</div>
				<div class="col-7 py-1" style="position: relative;">
					<h2>${pinHeader}</h2>
					<p><i>${pin.fictional_location}</i></p>
					<p>${pinAddress}</p>
				</div>
			</div>`;
}

const CUSTOM_POPUP_OPTIONS = {
  "minWidth": "460",
  "maxWidth": "460",
  "className": "popupCustom"
};


// Create map location data for movies, tv, and books

const MOVIES = [];
const TV = [];
const BOOKS = [];

export async function getOrAddMovies() {
  if (MOVIES.length === 0) {
    let movieArray = await tsvToArray("/assets/MM dataset OFFICIAL - FILM.tsv");

    // Check required values and create pin entries
    let movies = [];
    movieArray.forEach(row => {
      if (row[0] != "" && row[3] != "" && row[4] != "" && row[5] != "" && row[7] != "" && row[8] != "" && row[9] != "") {
        let pin = {
          id: row[0],
          name: row[3],
          year: row[4],
          fictional_location: row[5],
          filming_location: row[6],
          location_address: row[7],
          location: { lat: parseFloat(row[8]), lng: parseFloat(row[9]) }
        };

        // Create marker and popup design
        pin = createPinMarker(pin);
        let customPopupContent = pinHTMLTemplate(pin, "-F", "FILM", `${pin.name} (${pin.year})`);
        pin.marker.bindPopup(customPopupContent, CUSTOM_POPUP_OPTIONS);

        // Show bar when a marker is clicked
        pin.marker.on("click", BOTTOM_BAR_MODULE.showBottomBar);

        movies.push(pin);
      }
    });

    MOVIES.push(...movies);
  }

  return (MOVIES);
}

export async function getOrAddTV() {
  if (TV.length === 0) {
    let tvArray = await tsvToArray("/assets/MM dataset OFFICIAL - TV.tsv");

    // Check required values and create pin entries
    let tv = [];
    tvArray.forEach(row => {
      if (row[0] != "" && row[3] != "" && row[7] != "" && row[10] != "" && row[11] != "") {
        let pin = {
          id: row[0],
          name: row[3],
          season: row[4],
          episode: row[5],
          episode_title: row[6],
          fictional_location: row[7],
          filming_location: row[8],
          location_address: row[9],
          location: { lat: parseFloat(row[10]), lng: parseFloat(row[11]) }
        };

        // Create marker and popup design
        pin = createPinMarker(pin);
        let episodeInfo = "";
        if (row[4] != "" && row[5] != "")
          episodeInfo = `(S${pin.season} E${pin.episode})`;

        let customPopupContent = pinHTMLTemplate(pin, "-TV", "TV", `${pin.name} ${episodeInfo}`);
        pin.marker.bindPopup(customPopupContent, CUSTOM_POPUP_OPTIONS);

        // Show bar when a marker is clicked
        pin.marker.on("click", BOTTOM_BAR_MODULE.showBottomBar);

        tv.push(pin);
      }
    });

    TV.push(...tv);
}

  return (TV);
}

export async function getOrAddBooks() {
  if (BOOKS.length === 0) {
    let booksArray = await tsvToArray("/assets/MM dataset OFFICIAL - LIT.tsv");

    // Check required values and create pin entries
    let books = [];
    booksArray.forEach(row => {
      if (row[0] != "" && row[3] != "" && row[4] != "" && row[5] != "" && row[6] != "" && row[8] != "" && row[9] != "" && row[10] != "") {
        let pin = {
          id: row[0],
          name: row[3],
          year: row[4],
          author: row[5],
          fictional_location: row[6],
          filming_location: row[7],
          location_address: row[8],
          location: { lat: parseFloat(row[9]), lng: parseFloat(row[10]) },
        };

        // Create marker and popup design
        pin = createPinMarker(pin);
        let customPopupContent = pinHTMLTemplate(pin, "-LIT", "LIT", `${pin.name} by ${pin.author} (${pin.year})`);
        pin.marker.bindPopup(customPopupContent, CUSTOM_POPUP_OPTIONS);

        // Show bar when a marker is clicked
        pin.marker.on("click", BOTTOM_BAR_MODULE.showBottomBar);

        books.push(pin);
      }
    });

    BOOKS.push(...books);
  }

  return (BOOKS);
}
