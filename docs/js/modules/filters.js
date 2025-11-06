// Module for filtering with search bar, button, and featured images


const CREATE_MAP_MODULE = await import("./create-map.js");

const PIN_DATA_MODULE = await import("./pin-data.js");

const JEKYLL_VARS = await import("./jekyll-liquid-templates.js");
const FEATURED_NAMES = JEKYLL_VARS.FEATURED_NAMES;

const SAVE_SEARCH_MODULE = await import("./save-search.js");
function saveSearchBarText() { SAVE_SEARCH_MODULE.saveSearchBarText(); }

const BOTTOM_BAR_MODULE = await import("./bottom-bar.js");

// Get map
const MAP = CREATE_MAP_MODULE.getOrCreateMap();

// Create variables
const MOVIES = await PIN_DATA_MODULE.getOrAddMovies();
const TV = await PIN_DATA_MODULE.getOrAddTV();
const BOOKS = await PIN_DATA_MODULE.getOrAddBooks();

const SHOW_ALL_BTN = document.getElementById("showAll");
const FILTER_FEATURED_BTN = document.getElementById("filterFeatured");
const FILTER_MOVIES_BTN = document.getElementById("filterMovies");
const FILTER_TV_BTN = document.getElementById("filterTV");
const FILTER_BOOKS_BTN = document.getElementById("filterBooks");

let selectedFeatureImage;

// Create booleans for filter button status
let allOn = false;
let moviesOn = false;
let tvOn = false;
let booksOn = false;
let featuredOn = false;

const FEATURED_BAR = document.getElementById("featured-bar");
const FEATURED_PINS = [];
FEATURED_PINS.push(...MOVIES.filter(pin => FEATURED_NAMES.has(pin.name)));
FEATURED_PINS.push(...TV.filter(pin => FEATURED_NAMES.has(pin.name)));
FEATURED_PINS.push(...BOOKS.filter(pin => FEATURED_NAMES.has(pin.name)));

const SEARCH_BAR = document.getElementById("filterTitle");
const SUGGESTIONS_BOX = document.getElementById("suggestions");

const MOVIE_NAMES_SET = new Set(MOVIES.map(item => item.name));
const TV_NAMES_SET = new Set(TV.map(item => item.name));
const BOOK_NAMES_SET = new Set(BOOKS.map(item => item.name));
const MEDIA_NAMES = [...MOVIE_NAMES_SET, ...TV_NAMES_SET, ...BOOK_NAMES_SET].sort((a, b) => a.localeCompare(b));


// Toggle style with state of filter buttons
function changeButtonStyle(elem, turnOn) {
  if (turnOn) {
    elem.style.backgroundColor = "#000000";
    elem.style.color = "#E7E08B";
    elem.classList.add("active");
  }
  else {
    elem.style.backgroundColor = "#E7E08B";
    elem.style.color = "#000000";
    elem.classList.remove("active");
  }
}

function clearSelectedFeatureImage() {
  if (selectedFeatureImage) {
    let name = selectedFeatureImage.id;
    if (MOVIE_NAMES_SET.has(name)) {
      MOVIES.forEach(pin => {
        if (pin.name === name)
          MAP.removeLayer(pin.marker);
      });
    }

    else if (TV_NAMES_SET.has(name)) {
      TV.forEach(pin => {
        if (pin.name === name)
          MAP.removeLayer(pin.marker)
      });
    }

    else if (BOOK_NAMES_SET.has(name)) {
      BOOKS.forEach(pin => {
        if (pin.name === name)
          MAP.removeLayer(pin.marker)
      });
    }

    selectedFeatureImage.classList.remove("active");
    selectedFeatureImage = null;
  }
}

function highlightFeaturedImage(elem) {
  if (elem !== selectedFeatureImage) {
    clearSelectedFeatureImage();

    elem.classList.add("active");
    selectedFeatureImage = elem;
  }
}


function filterFeatured() {
  if (!featuredOn) {
    saveSearchBarText();
    clearSelectedFeatureImage();

    MOVIES.forEach(pin => {
      if (FEATURED_PINS.includes(pin))
        MAP.addLayer(pin.marker);
      else
        MAP.removeLayer(pin.marker);
    });

    TV.forEach(pin => {
      if (FEATURED_PINS.includes(pin))
        MAP.addLayer(pin.marker);
      else
        MAP.removeLayer(pin.marker);
    });

    BOOKS.forEach(pin => {
      if (FEATURED_PINS.includes(pin))
        MAP.addLayer(pin.marker);
      else
        MAP.removeLayer(pin.marker);
    });

    changeButtonStyle(SHOW_ALL_BTN, false);
    changeButtonStyle(FILTER_MOVIES_BTN, false);
    changeButtonStyle(FILTER_TV_BTN, false);
    changeButtonStyle(FILTER_BOOKS_BTN, false);
    changeButtonStyle(FILTER_FEATURED_BTN, true);
    allOn = false;
    moviesOn = false;
    tvOn = false;
    booksOn = false;
    featuredOn = true;
  }

  BOTTOM_BAR_MODULE.showBottomBar();
}

function showAll() {
  if (!allOn) {
    saveSearchBarText();
    clearSelectedFeatureImage();

    MOVIES.forEach(pin => { MAP.addLayer(pin.marker); });
    TV.forEach(pin => { MAP.addLayer(pin.marker); });
    BOOKS.forEach(pin => { MAP.addLayer(pin.marker); });

    changeButtonStyle(SHOW_ALL_BTN, true);
    changeButtonStyle(FILTER_MOVIES_BTN, false);
    changeButtonStyle(FILTER_TV_BTN, false);
    changeButtonStyle(FILTER_BOOKS_BTN, false);
    changeButtonStyle(FILTER_FEATURED_BTN, false);

    allOn = true;
    moviesOn = false;
    tvOn = false;
    booksOn = false;
    featuredOn = false;
  }
};

function filterMovies() {
  saveSearchBarText();
  clearSelectedFeatureImage();

  if (moviesOn) {
    MOVIES.forEach(pin => { MAP.removeLayer(pin.marker); });
    changeButtonStyle(FILTER_MOVIES_BTN, false);
    moviesOn = false;
  }
  else {
    MOVIES.forEach(pin => { MAP.addLayer(pin.marker); });

    if (allOn) {
      TV.forEach(pin => { MAP.removeLayer(pin.marker); });
      BOOKS.forEach(pin => { MAP.removeLayer(pin.marker); });
      changeButtonStyle(SHOW_ALL_BTN, false);
      changeButtonStyle(FILTER_MOVIES_BTN, true);
      allOn = false;
      moviesOn = true;
    }
    else {
      if (tvOn && booksOn) {
        SHOW_ALL_BTN.focus();
        changeButtonStyle(SHOW_ALL_BTN, true);
        changeButtonStyle(FILTER_MOVIES_BTN, false);
        changeButtonStyle(FILTER_TV_BTN, false);
        changeButtonStyle(FILTER_BOOKS_BTN, false);
        allOn = true;
        moviesOn = false;
        tvOn = false;
        booksOn = false;
      }
      else {
        changeButtonStyle(FILTER_MOVIES_BTN, true);
        moviesOn = true;

        if (featuredOn) {
          TV.forEach(pin => { MAP.removeLayer(pin.marker); });
          BOOKS.forEach(pin => { MAP.removeLayer(pin.marker); });

          changeButtonStyle(FILTER_FEATURED_BTN, false);
          featuredOn = false;
        }
      }
    }
  }
};

function filterTV() {
  saveSearchBarText();
  clearSelectedFeatureImage();

  if (tvOn) {
    TV.forEach(pin => { MAP.removeLayer(pin.marker); });
    changeButtonStyle(FILTER_TV_BTN, false);
    tvOn = false;
  }
  else {
    TV.forEach(pin => { MAP.addLayer(pin.marker); });

    if (allOn) {
      MOVIES.forEach(pin => { MAP.removeLayer(pin.marker); });
      BOOKS.forEach(pin => { MAP.removeLayer(pin.marker); });
      changeButtonStyle(SHOW_ALL_BTN, false);
      changeButtonStyle(FILTER_TV_BTN, true);
      allOn = false;
      tvOn = true;
    }
    else {
      if (moviesOn && booksOn) {
        SHOW_ALL_BTN.focus();
        changeButtonStyle(SHOW_ALL_BTN, true);
        changeButtonStyle(FILTER_MOVIES_BTN, false);
        changeButtonStyle(FILTER_TV_BTN, false);
        changeButtonStyle(FILTER_BOOKS_BTN, false);
        allOn = true;
        moviesOn = false;
        tvOn = false;
        booksOn = false;
      }
      else {
        changeButtonStyle(FILTER_TV_BTN, true);
        tvOn = true;

        if (featuredOn) {
          MOVIES.forEach(pin => { MAP.removeLayer(pin.marker); });
          BOOKS.forEach(pin => { MAP.removeLayer(pin.marker); });

          changeButtonStyle(FILTER_FEATURED_BTN, false);
          featuredOn = false;
        }
      }
    }
  }
};

function filterBooks() {
  saveSearchBarText();
  clearSelectedFeatureImage();

  if (booksOn) {
    BOOKS.forEach(pin => { MAP.removeLayer(pin.marker); });
    changeButtonStyle(FILTER_BOOKS_BTN, false);
    booksOn = false;
  }
  else {
    BOOKS.forEach(pin => { MAP.addLayer(pin.marker); });

    if (allOn) {
      MOVIES.forEach(pin => { MAP.removeLayer(pin.marker); });
      TV.forEach(pin => { MAP.removeLayer(pin.marker); });
      changeButtonStyle(SHOW_ALL_BTN, false);
      changeButtonStyle(FILTER_BOOKS_BTN, true);
      allOn = false;
      booksOn = true;
    }
    else {
      if (moviesOn && tvOn) {
        SHOW_ALL_BTN.focus();
        changeButtonStyle(SHOW_ALL_BTN, true);
        changeButtonStyle(FILTER_MOVIES_BTN, false);
        changeButtonStyle(FILTER_TV_BTN, false);
        changeButtonStyle(FILTER_BOOKS_BTN, false);
        allOn = true;
        moviesOn = false;
        tvOn = false;
        booksOn = false;
      }
      else {
        changeButtonStyle(FILTER_BOOKS_BTN, true);
        booksOn = true;

        if (featuredOn) {
          MOVIES.forEach(pin => { MAP.removeLayer(pin.marker); });
          TV.forEach(pin => { MAP.removeLayer(pin.marker); });

          changeButtonStyle(FILTER_FEATURED_BTN, false);
          featuredOn = false;
        }
      }
    }
  }
};

function showSingleFeatured(elem) {
  let name = elem.id;
  saveSearchBarText();

  if (MOVIE_NAMES_SET.has(name)) {
    MOVIES.forEach(pin => {
      if (pin.name === name)
        MAP.addLayer(pin.marker);
      else
        MAP.removeLayer(pin.marker)
    });
    TV.forEach(pin => MAP.removeLayer(pin.marker));
    BOOKS.forEach(pin => MAP.removeLayer(pin.marker));
  }

  else if (TV_NAMES_SET.has(name)) {
    TV.forEach(pin => {
      if (pin.name === name)
        MAP.addLayer(pin.marker);
      else
        MAP.removeLayer(pin.marker)
    });
    MOVIES.forEach(pin => MAP.removeLayer(pin.marker));
    BOOKS.forEach(pin => MAP.removeLayer(pin.marker));
  }

  else if (BOOK_NAMES_SET.has(name)) {
    BOOKS.forEach(pin => {
      if (pin.name === name)
        MAP.addLayer(pin.marker);
      else
        MAP.removeLayer(pin.marker)
    });
    MOVIES.forEach(pin => MAP.removeLayer(pin.marker));
    TV.forEach(pin => MAP.removeLayer(pin.marker));
  }

  else {
    MOVIES.forEach(pin => MAP.removeLayer(pin.marker));
    BOOKS.forEach(pin => MAP.removeLayer(pin.marker));
    TV.forEach(pin => MAP.removeLayer(pin.marker));
  }

  changeButtonStyle(SHOW_ALL_BTN, false);
  changeButtonStyle(FILTER_MOVIES_BTN, false);
  changeButtonStyle(FILTER_TV_BTN, false);
  changeButtonStyle(FILTER_BOOKS_BTN, false);
  changeButtonStyle(FILTER_FEATURED_BTN, false);
  allOn = false;
  moviesOn = false;
  tvOn = false;
  booksOn = false;
  featuredOn = false;
  
  highlightFeaturedImage(elem);
}

function filterTitle() {
  let term = SEARCH_BAR.value.toLowerCase().trim();

  if (term === "")
    showAll();
  else {
    clearSelectedFeatureImage();
    MOVIES.forEach(pin => {
      if (!pin.name.toLowerCase().startsWith(term))
        MAP.removeLayer(pin.marker);
      else if (!MAP.hasLayer(pin.marker))
        MAP.addLayer(pin.marker);
    });

    TV.forEach(pin => {
      if (!pin.name.toLowerCase().startsWith(term))
        MAP.removeLayer(pin.marker);
      else if (!MAP.hasLayer(pin.marker))
        MAP.addLayer(pin.marker);
    });

    BOOKS.forEach(pin => {
      if (!pin.name.toLowerCase().startsWith(term))
        MAP.removeLayer(pin.marker);
      else if (!MAP.hasLayer(pin.marker))
        MAP.addLayer(pin.marker);
    });

    changeButtonStyle(SHOW_ALL_BTN, false);
    changeButtonStyle(FILTER_MOVIES_BTN, false);
    changeButtonStyle(FILTER_TV_BTN, false);
    changeButtonStyle(FILTER_BOOKS_BTN, false);
    changeButtonStyle(FILTER_FEATURED_BTN, false);
    allOn = false;
    moviesOn = false;
    tvOn = false;
    booksOn = false;
  }
};

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    userValue = SEARCH_BAR.value;
    listData = "<li>" + userValue + "</li>";
  }
  else {
    listData = list.join("");
  }
  SUGGESTIONS_BOX.innerHTML = listData;
}

function useSuggestion(elem) {
  SEARCH_BAR.value = elem.innerHTML;
  SUGGESTIONS_BOX.innerHTML = "<li>" + elem.innerHTML + "</li>";
  SUGGESTIONS_BOX.style = "display: none;";
  filterTitle();
}


export function createFilterListeners() {
  // Start with featured pins on
  filterFeatured();

  // Add event listeners for bottom bar
  FILTER_FEATURED_BTN.addEventListener("click", filterFeatured);
  SHOW_ALL_BTN.addEventListener("click", showAll);
  FILTER_MOVIES_BTN.addEventListener("click", filterMovies);
  FILTER_TV_BTN.addEventListener("click", filterTV);
  FILTER_BOOKS_BTN.addEventListener("click", filterBooks);
  FEATURED_BAR.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
      let parentDiv = event.target.parentElement;
      showSingleFeatured(parentDiv);
    }
  });

  // Add event listeners for search and suggestion functionality
  SEARCH_BAR.addEventListener("input", (event) => {
    filterTitle();

    let userData = event.target.value;
    let suggestions = [];
    if (userData) {
      SUGGESTIONS_BOX.style = "display: block;";

      suggestions = MEDIA_NAMES.filter((data) => {
        return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
      });

      if (suggestions.length > 5)
        suggestions = suggestions.slice(0, 5);

      suggestions = suggestions.map((data) => {
        return data = "<li>" + data + "</li>";
      });
      showSuggestions(suggestions);
      SEARCH_BAR.style = "border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
    }
    else {
      SUGGESTIONS_BOX.innerHTML = "";
      SUGGESTIONS_BOX.style = "display: none;";
      SEARCH_BAR.style = "";
    }
  });

  SEARCH_BAR.addEventListener("focusin", () => {
    SUGGESTIONS_BOX.style = "display: block;";
    if (SUGGESTIONS_BOX.innerHTML != "")
      SEARCH_BAR.style = "border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
  });

  SEARCH_BAR.addEventListener("focusout", () => {
    SEARCH_BAR.style = "";
    // Delay hiding suggestions box to allow suggestions box click event to register
    setTimeout(() => {
      SUGGESTIONS_BOX.style = "display: none;";
    }, 100);
  });

  SUGGESTIONS_BOX.addEventListener("click", (event) => {
    if (event.target.tagName === "LI")
      useSuggestion(event.target);
  });
}
