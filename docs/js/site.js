document.addEventListener("DOMContentLoaded", init);

async function init() {
	const CREATE_MAP_MODULE = await import("./modules/create-map.js");

	const PIN_DATA_MODULE = await import("./modules/pin-data.js");
	
	const BOTTOM_BAR_MODULE = await import("./modules/bottom-bar.js");

	const FILTERS_MODULE = await import("./modules/filters.js");

	const INTERACTIONS = await import("./modules/interactions.js");

	const POPUP_MODAL_MODULE = await import("./modules/popup-modal.js");


	// Create Leaflet map
	const MAP = CREATE_MAP_MODULE.getOrCreateMap();

	// Add custom map style
	L.tileLayer("https://api.mapbox.com/styles/v1/mediamapmvp/cm6sgz4dy016201ry1r0o6c1q/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWVkaWFtYXBtdnAiLCJhIjoiY202cHpqNHR2MTZmMDJycTB1YzkzaDk2MCJ9.0J87bgTD7XKdBP5NH07wuA", {
	}).addTo(MAP);

	// Add pin data
	PIN_DATA_MODULE.getOrAddMovies();
	PIN_DATA_MODULE.getOrAddTV();
	PIN_DATA_MODULE.getOrAddBooks();

	// Show/hide bottom bar with map zoom
	const ORIGINAL_ZOOM = MAP.getZoom();

	// Timeout for final zoom value to be updated without waiting for zoomend
	MAP.on("zoomstart", () => {
		setTimeout(() => {
			if (MAP.getZoom() > ORIGINAL_ZOOM)
				BOTTOM_BAR_MODULE.hideBottomBar();
			else
				BOTTOM_BAR_MODULE.showBottomBar();
		}, 20);
	});

	// Most of the logic is here
	// Also runs featured filter so map starts with only featured pins
	FILTERS_MODULE.createFilterListeners();

	// Create listeners for add form, follow, and search inteactions
	INTERACTIONS.createEventListeners();

	// TODO Hide until properly implemented (only run on first visit)
	// POPUP_MODAL_MODULE.initPopupModal();
}
