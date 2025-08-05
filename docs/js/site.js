---
---

document.addEventListener('DOMContentLoaded', init, false);

async function init() {

	function tsvToArray(tsvString, delimiter = "	") {
		const rows = tsvString.split("\n");
		return rows.map(row => row.split(delimiter));
	}

	// Create map location data
	async function getMovies() {

		let movies = [];

		// Pull from tsv file with location data
		let tsv_data = await fetch("/assets/MM dataset OFFICIAL - FILM.tsv")
			.then(res => res.text())
			.then(data => { return (data); });

		// Convert to array then remove column names row
		let movieArray = tsvToArray(tsv_data);
		movieArray.splice(0, 1);

		movieArray.forEach(row => {
			if (row[0] != "" && row[3] != "" && row[4] != "" && row[5] != "" && row[7] != "" && row[8] != "" && row[9] != "") {
				movies.push(
					{
						id: row[0],
						name: row[3],
						year: row[4],
						fictional_location: row[5],
						filming_location: row[6],
						location_address: row[7],
						location: { lat: parseFloat(row[8]), lng: parseFloat(row[9]) }
					}
				);
			}
		});
		return (movies);
	}

	async function getTV() {

		let tv = [];

		// Pull from tsv file with location data
		let tsv_data = await fetch("/assets/MM dataset OFFICIAL - TV.tsv")
			.then(res => res.text())
			.then(data => { return (data); });

		// Convert to array then remove column names row
		let tvArray = tsvToArray(tsv_data);
		tvArray.splice(0, 1);

		tvArray.forEach(row => {
			if (row[0] != "" && row[3] != "" && row[4] != "" && row[5] != "" && row[6] != "" && row[8] != "" && row[9] != "" && row[10] != "" && row[13] != "") {
				tv.push(
					{
						id: row[0],
						name: row[3],
						season: row[4],
						episode: row[5],
						fictional_location: row[6],
						filming_location: row[7],
						location_address: row[8],
						location: { lat: parseFloat(row[9]), lng: parseFloat(row[10]) },
						episode_title: row[13]
					}
				);
			}
		});
		return (tv);
	}

	async function getBooks() {

		let books = [];

		// Pull from tsv file with location data
		let tsv_data = await fetch("/assets/MM dataset OFFICIAL - LIT.tsv")
			.then(res => res.text())
			.then(data => { return (data); });

		// Convert to array then remove column names row
		let booksArray = tsvToArray(tsv_data);
		booksArray.splice(0, 1);

		booksArray.forEach(row => {
			if (row[0] != "" && row[3] != "" && row[4] != "" && row[5] != "" && row[6] != "" && row[8] != "" && row[9] != "" && row[10] != "") {
				tv.push(
					{
						id: row[0],
						name: row[3],
						year: row[4],
						author: row[5],
						fictional_location: row[6],
						filming_location: row[7],
						location_address: row[8],
						location: { lat: parseFloat(row[9]), lng: parseFloat(row[10]) },
					}
				);
			}
		});
		return (books);
	}


	// Setup map variables
	let ColorIcon = L.Icon.extend({
		options: {
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
			iconSize: [25, 41],
			shadowSize: [41, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34]
		}
	});

	let blackIcon = new ColorIcon({ iconUrl: '/images/map-marker.svg' });

	let movies = await getMovies();
	let tv = await getTV();
	let books = await getBooks();


	// Create and fill map
	var map = L.map('map', {
		zoomControl: false
	}).setView([40.76, -73.98], 12);
	map.attributionControl.setPrefix(false);

	L.tileLayer('https://api.mapbox.com/styles/v1/mediamapmvp/cm6sgz4dy016201ry1r0o6c1q/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWVkaWFtYXBtdnAiLCJhIjoiY202cHpqNHR2MTZmMDJycTB1YzkzaDk2MCJ9.0J87bgTD7XKdBP5NH07wuA', {
	}).addTo(map);

	let customPopupOptions = {
    	'minWidth': '460',
		'maxWidth': '460',
		'className': 'popupCustom'
	};

  // Setup Jekyll file search
  // {% assign image_files = site.static_files | where: "image", true %}
  let imageFiles = [];
  // {% for image in image_files %}
  imageFiles.push("{{ image.path }}");
  // {% endfor %}

	let sampleImg = "{{ site.images.sample }}";


	movies.forEach(s => {
		s.marker = L.marker([s.location.lat, s.location.lng], { icon: blackIcon }).addTo(map);

    let customPopupContent = '<div class="row align-items-stretch" style="min-height: 120px;">';

    let imgName = s.id.split("-F")[0] + "-FILM.png";
    let imgUrl = `/images/media/FILM/${s.name}/${imgName}`;

    if (imageFiles.includes(imgUrl)) {
      customPopupContent += `<div class="col-5 d-flex justify-content-center"><img src="${imgUrl}" title="${s.name}" alt="${s.name}" width=100% style="object-fit: contain;"></div>`;
    }
		else
		{
			console.log(imgUrl);
      customPopupContent += `<div class="col-5 d-flex justify-content-center"><img src="${sampleImg}" title="${s.name}" alt="${s.name}" width=100% style="object-fit: contain;"></div>`;
		}

		if (s.filming_location) {
			customPopupContent += `<div class="col-7 py-1" style="position: relative;"><h2>${s.name} (${s.year})</h2><p><i>${s.fictional_location}</i></p><p>${s.filming_location}, ${s.location_address}</p></div>`;
		}
		else {
			customPopupContent += `<div class="col-7 py-1" style="position: relative;"><h2>${s.name} (${s.year})</h2><p><i>${s.fictional_location}</i></p><p>${s.location_address}</p></div>`;
		}

    customPopupContent += "</div>";
    s.marker.bindPopup(customPopupContent, customPopupOptions);
	});


	tv.forEach(s => {
		s.marker = L.marker([s.location.lat, s.location.lng], { icon: blackIcon }).addTo(map);

    let customPopupContent = '<div class="row align-items-stretch" style="min-height: 120px;">';

    let imgName = s.id.split("-TV")[0] + "-TV.png";
    let imgUrl = `/images/media/TV/${s.name}/${imgName}`;

    if (imageFiles.includes(imgUrl)) {
      customPopupContent += `<div class="col-5 d-flex justify-content-center"><img src="${imgUrl}" title="${s.name}" alt="${s.name}" width=100% style="object-fit: contain;"></div>`;
    }
		else
		{
			console.log(imgUrl);
      customPopupContent += `<div class="col-5 d-flex justify-content-center"><img src="${sampleImg}" title="${s.name}" alt="${s.name}" width=100% style="object-fit: contain;"></div>`;
		}

		if (s.filming_location) {
			customPopupContent += `<div class="col-7 py-1" style="position: relative;"><h2>${s.name} (S${s.season} E${s.episode})</h2><p><i>${s.fictional_location}</i></p><p>${s.filming_location}, ${s.location_address}</p></div>`;

		}
		else {
			customPopupContent += `<div class="col-7 py-1" style="position: relative;"><h2>${s.name} (S${s.season} E${s.episode})</h2><p><i>${s.fictional_location}</i></p><p>${s.location_address}</p></div>`;
		};
    customPopupContent += "</div>";
    s.marker.bindPopup(customPopupContent, customPopupOptions);
	});


	books.forEach(s => {
		s.marker = L.marker([s.location.lat, s.location.lng], { icon: blackIcon }).addTo(map);

    let customPopupContent = '<div class="row align-items-stretch" style="min-height: 120px;">';

    let imgName = s.id.split("-LIT")[0] + "-LIT.png";
    let imgUrl = `/images/media/LIT/${s.name}/${imgName}`;

    if (imageFiles.includes(imgUrl)) {
      customPopupContent += `<div class="col-5 d-flex justify-content-center"><img src="${imgUrl}" title="${s.name}" alt="${s.name}" width=100% style="object-fit: contain;"></div>`;
    }
		else
		{
			console.log(imgUrl);
      customPopupContent += `<div class="col-5 d-flex justify-content-center"><img src="${sampleImg}" title="${s.name}" alt="${s.name}" width=100% style="object-fit: contain;"></div>`;
		}

		if (s.filming_location) {
			customPopupContent += `<div class="col-7 py-1" style="position: relative;"><h2>${s.name} by ${s.author} (${s.year})</h2><p><i>${s.fictional_location}</i></p><p>${s.filming_location}, ${s.location_address}</p></div>`;
		}
		else {
			customPopupContent += `<div class="col-7 py-1" style="position: relative;"><h2>${s.name} by ${s.author} (${s.year})</h2><p><i>${s.fictional_location}</i></p><p>${s.location_address}</p></div>`;
		};
    
    customPopupContent += "</div>";
    s.marker.bindPopup(customPopupContent, customPopupOptions);
	});


	// Shorten "LITERATURE" to "BOOKS" for mobile
	if (window.innerWidth < 450) {
		$filterBooks.innerHTML = "BOOKS";
	}

	// Popup Modal Functionality
	const popupModal = document.getElementById('popupModal');
	const popupForm = document.querySelector('#popupModal form');
	const popupBackdrop = document.getElementById('popupBackdrop');

	// Show popup modal after 10 seconds
	setTimeout(() => {
		const modal = bootstrap.Modal.getOrCreateInstance(popupModal);
		modal.show();
	}, 10000);

	// Show/hide gradient backdrop with modal
	popupModal.addEventListener('show.bs.modal', () => {
		popupBackdrop.style.display = 'block';
		setTimeout(function () {
			popupBackdrop.style.opacity = '1';
		}, 100); 
	});
	popupModal.addEventListener('hidden.bs.modal', () => {
		popupBackdrop.style.opacity = '0';
		setTimeout(function () {
			popupBackdrop.style.display = 'none';
		}, 1000); 
	});
		
	// Change aria visibility
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				popupModal.setAttribute('aria-hidden', 'false');
			} else {
				popupModal.setAttribute('aria-hidden', 'true');
			}
		});
	}, {
		threshold: 0.1
	});

	observer.observe(popupModal);

	popupForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('loginEmail').value;
		// Here you would typically handle the email signup logic
		console.log('Form submitted:', { email });
		// Clear form and close modal
		popupForm.reset();
		bootstrap.Modal.getInstance(popupModal).hide();
	});


	// Create event listeners for filtering/element states
	let $showAll = document.querySelector('#showAll');
	let $filterMovies = document.querySelector('#filterMovies');
	let $filterTV = document.querySelector('#filterTV');
	let $filterBooks = document.querySelector('#filterBooks');
	let $filterTitle = document.querySelector('#filterTitle');
	let $suggestionsBox = document.querySelector("#suggestions");


	let $addBtn = document.querySelector('#addBtn');
	let $followBtn = document.querySelector('#followBtn');

	// Create listeners for saving search data and focusing/bluring when using add btn
	let filterTitleValue = "";

	function savefilterTitle() {
		if ($filterTitle.value != "") {
			filterTitleValue = $filterTitle.value;
			$filterTitle.value = "";
		}
	}

	$addBtn.addEventListener("mouseover", function () {
		savefilterTitle()
		$addBtn.focus();
	});

	$followBtn.addEventListener("mouseover", savefilterTitle());

	let $titleField = document.querySelector('#title');
	let $descField = document.querySelector('#description');
	let $emailField = document.querySelector('#addEmail');

	let $filterTitleDiv = document.querySelector('#filterTitleDiv');

	$filterTitleDiv.addEventListener("mouseover", function () {
		$addBtn.blur();
		$titleField.blur();
		$descField.blur();
		$emailField.blur();

		if (filterTitleValue != "") {
			$filterTitle.value = filterTitleValue;
			filterTitleValue = "";
		}
	});

	let $addForm = document.querySelector('#addForm');
	$addForm.addEventListener("mouseleave", function () {
		$addBtn.focus();
	});

	// Listener for add form sizing
	$descField.addEventListener('input', function() {
	if (this.scrollHeight < 6 * parseFloat(getComputedStyle(document.documentElement).fontSize)) {
		this.style.height = 'auto';
		this.style.height = `${this.scrollHeight}px`;
	}
	});

	// Add functionality to map filter buttons
	let allOn = true;
	let moviesOn = false;
	let tvOn = false;
	let booksOn = false;

	const changeButtonStyle = (elem, turnOn) => {
		if (!elem) return;
		if (turnOn) {
			elem.style.backgroundColor = "#000000";
			elem.style.color = "#E7E08B";
			elem.classList.add('active');
		}
		else {
			elem.style.backgroundColor = "#E7E08B";
			elem.style.color = "#000000";
			elem.classList.remove('active');
		}
	}

	const showAll = () => {
		$filterTitle.value = "";
		movies.forEach(s => { map.addLayer(s.marker); });
		tv.forEach(s => { map.addLayer(s.marker); });
		books.forEach(s => { map.addLayer(s.marker); });
		changeButtonStyle($showAll, true);
		changeButtonStyle($filterMovies, false);
		changeButtonStyle($filterTV, false);
		changeButtonStyle($filterBooks, false);
		changeButtonStyle($filterFeatured, false);
		allOn = true;
		moviesOn = false;
		tvOn = false;
		booksOn = false;
	};

	$showAll.addEventListener('click', showAll);

	const filterMovies = () => {
		$filterTitle.value = "";
		if (moviesOn) {
			movies.forEach(s => { map.removeLayer(s.marker); });
			changeButtonStyle($filterMovies, false);
			moviesOn = false;
		}
		else {
			movies.forEach(s => { map.addLayer(s.marker); });
			if (allOn) {
				tv.forEach(s => { map.removeLayer(s.marker); });
				books.forEach(s => { map.removeLayer(s.marker); });
				changeButtonStyle($showAll, false);
				changeButtonStyle($filterMovies, true);
				changeButtonStyle($filterFeatured, false);
				allOn = false;
				moviesOn = true;
			}
			else {
				if (tvOn && booksOn) {
					tv.forEach(s => { map.addLayer(s.marker); });
					books.forEach(s => { map.addLayer(s.marker); });
					$showAll.focus();
					changeButtonStyle($showAll, true);
					changeButtonStyle($filterMovies, false);
					changeButtonStyle($filterTV, false);
					changeButtonStyle($filterBooks, false);
					changeButtonStyle($filterFeatured, false);
					allOn = true;
					moviesOn = false;
					tvOn = false;
					booksOn = false;
				}
				else {
					moviesOn = true;
					changeButtonStyle($filterMovies, true);
					changeButtonStyle($filterFeatured, false);
				}
			}
		}
	};

	$filterMovies.addEventListener('click', filterMovies);

	const filterTV = () => {
		$filterTitle.value = "";
		if (tvOn) {
			tv.forEach(s => { map.removeLayer(s.marker); });
			changeButtonStyle($filterTV, false);
			tvOn = false;
		}
		else {
			tv.forEach(s => { map.addLayer(s.marker); });
			if (allOn) {
				movies.forEach(s => { map.removeLayer(s.marker); });
				books.forEach(s => { map.removeLayer(s.marker); });
				changeButtonStyle($showAll, false);
				changeButtonStyle($filterTV, true);
				changeButtonStyle($filterFeatured, false);
				allOn = false;
				tvOn = true;
			}
			else {
				if (moviesOn && booksOn) {
					movies.forEach(s => { map.addLayer(s.marker); });
					books.forEach(s => { map.addLayer(s.marker); });
					$showAll.focus();
					changeButtonStyle($showAll, true);
					changeButtonStyle($filterMovies, false);
					changeButtonStyle($filterTV, false);
					changeButtonStyle($filterBooks, false);
					changeButtonStyle($filterFeatured, false);
					allOn = true;
					moviesOn = false;
					tvOn = false;
					booksOn = false;
				}
				else {
					tvOn = true;
					changeButtonStyle($filterTV, true);
					changeButtonStyle($filterFeatured, false);
				}
			}
		}
	};

	$filterTV.addEventListener('click', filterTV);

	const filterBooks = () => {
		$filterTitle.value = "";
		if (booksOn) {
			books.forEach(s => { map.removeLayer(s.marker); });
			changeButtonStyle($filterBooks, false);
			booksOn = false;
		}
		else {
			books.forEach(s => { map.addLayer(s.marker); });
			if (allOn) {
				movies.forEach(s => { map.removeLayer(s.marker); });
				tv.forEach(s => { map.removeLayer(s.marker); });
				changeButtonStyle($showAll, false);
				changeButtonStyle($filterBooks, true);
				changeButtonStyle($filterFeatured, false);
				allOn = false;
				booksOn = true;
			}
			else {
				if (moviesOn && tvOn) {
					movies.forEach(s => { map.addLayer(s.marker); });
					tv.forEach(s => { map.addLayer(s.marker); });
					$showAll.focus();
					changeButtonStyle($showAll, true);
					changeButtonStyle($filterMovies, false);
					changeButtonStyle($filterTV, false);
					changeButtonStyle($filterBooks, false);
					changeButtonStyle($filterFeatured, false);
					allOn = true;
					moviesOn = false;
					tvOn = false;
					booksOn = false;
				}
				else {
					booksOn = true;
					changeButtonStyle($filterBooks, true);
					changeButtonStyle($filterFeatured, false);
				}
			}
		}
	};

	$filterBooks.addEventListener('click', filterBooks);

	const filterTitle = () => {

		let term = $filterTitle.value.toLowerCase().trim();

		movies.forEach(s => {
			if (
				(term !== '' && s.name.toLowerCase().indexOf(term) === -1)
			) map.removeLayer(s.marker);
			else if (!map.hasLayer(s.marker)) map.addLayer(s.marker);
		});

		tv.forEach(s => {
			if (
				(term !== '' && s.name.toLowerCase().indexOf(term) === -1)
			) map.removeLayer(s.marker);
			else if (!map.hasLayer(s.marker)) map.addLayer(s.marker);
		});

		books.forEach(s => {
			if (
				(term !== '' && s.name.toLowerCase().indexOf(term) === -1)
			) map.removeLayer(s.marker);
			else if (!map.hasLayer(s.marker)) map.addLayer(s.marker);
		});

		changeButtonStyle($showAll, false);
		changeButtonStyle($filterMovies, false);
		changeButtonStyle($filterTV, false);
		changeButtonStyle($filterBooks, false);
		changeButtonStyle($filterFeatured, false);
		allOn = false;
		moviesOn = false;
		tvOn = false;
		booksOn = false;

		if (term === '') {
			changeButtonStyle($showAll, true);
			changeButtonStyle($filterMovies, false);
			changeButtonStyle($filterTV, false);
			changeButtonStyle($filterBooks, false);
			changeButtonStyle($filterFeatured, false);

			allOn = true;
			moviesOn = false;
			tvOn = false;
			booksOn = false;
		}

	};

	$filterTitle.addEventListener('input', filterTitle);


	// TODO
	// Add suggestions to search
	let mediaNamesSet = new Set();
	movies.forEach(m => mediaNamesSet.add(m.name));
	tv.forEach(t => mediaNamesSet.add(t.name));
	books.forEach(b => mediaNamesSet.add(b.name));
	let mediaNames = Array.from(mediaNamesSet);

	function showSuggestions(list) {
		let listData;
		if (!list.length) {
			userValue = $filterTitle.value;
			listData = '<li>' + userValue + '</li>';
		}
		else {
			listData = list.join('');
		}
		$suggestionsBox.innerHTML = listData;
	}

	const useSuggestion = (elem) => {
		$filterTitle.value = elem.innerHTML;
		$suggestionsBox.innerHTML = '<li>' + elem.innerHTML + '</li>';
		$suggestionsBox.style = "display: none;";
		filterTitle();
	}

	$filterTitle.onkeyup = (e) => {
		let userData = e.target.value;
		let suggestions = [];
		if (userData) {
			suggestions = mediaNames.filter((data) => {
				return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
			});

			if (suggestions.length > 5)
				suggestions = suggestions.slice(0, 5);

			suggestions = suggestions.map((data) => {
				return data = '<li>' + data + '</li>';
			});
			showSuggestions(suggestions);
			let suggestionsElems = $suggestionsBox.querySelectorAll("li");
			for (let i = 0; i < suggestionsElems.length; i++) {
				suggestionsElems[i].addEventListener("click", function () { useSuggestion(suggestionsElems[i]) });
			}

			$filterTitle.style = "border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
		}
		else {
			$suggestionsBox.innerHTML = '';
			$filterTitle.style = '';
		}
	}

	$filterTitle.addEventListener('focusin', function () {
		$suggestionsBox.style = "display: block;";
		if ($suggestionsBox.innerHTML != '')
			$filterTitle.style = "border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
	});

	$filterTitle.addEventListener('focusout', function () {
		$suggestionsBox.style = "display: none;";
		$filterTitle.style = '';
	});

	$filterTitle.addEventListener('input', function (event) {
		if (!event.target.value) {
			$suggestionsBox.innerHTML = '';
			$suggestionsBox.style = "display: none;";
			$filterTitle.style = '';
		}
	});

	const imageBar = document.getElementById('film-image-bar');
	const imageBarGradient = document.getElementById('film-image-bar-gradient');

	function showOnlyPinsForName(name) {
		movies.forEach(s => map.removeLayer(s.marker));
		tv.forEach(s => map.removeLayer(s.marker));
		books.forEach(s => map.removeLayer(s.marker));
		movies.forEach(s => { if (s.name === name) map.addLayer(s.marker); });
		tv.forEach(s => { if (s.name === name) map.addLayer(s.marker); });
		books.forEach(s => { if (s.name === name) map.addLayer(s.marker); });
		changeButtonStyle($showAll, false);
		changeButtonStyle($filterMovies, false);
		changeButtonStyle($filterTV, false);
		changeButtonStyle($filterBooks, false);
		changeButtonStyle($filterFeatured, false);
		allOn = false;
		moviesOn = false;
		tvOn = false;
		booksOn = false;
	}

	function showAllPins() {
		movies.forEach(s => map.addLayer(s.marker));
		tv.forEach(s => map.addLayer(s.marker));
		books.forEach(s => map.addLayer(s.marker));
		changeButtonStyle($showAll, true);
		changeButtonStyle($filterMovies, false);
		changeButtonStyle($filterTV, false);
		changeButtonStyle($filterBooks, false);
		changeButtonStyle($filterFeatured, false);
		allOn = true;
		moviesOn = false;
		tvOn = false;
		booksOn = false;
	}

	if (imageBar) {
		imageBar.querySelectorAll('img').forEach(img => {
			img.style.cursor = 'pointer';
			img.addEventListener('click', (e) => {
				showOnlyPinsForName(img.alt.replace(/ \(TV\)| \(LIT\)/, ''));
				// Unhighlight ALL button
				if (typeof changeButtonStyle === 'function' && $showAll) {
					changeButtonStyle($showAll, false);
				} else if ($showAll) {
					$showAll.style.backgroundColor = '#E7E08B';
					$showAll.style.color = '#000000';
				}
			});
		});
	}
	if (imageBarGradient) {
		imageBarGradient.addEventListener('click', showAllPins);
	}
	document.body.addEventListener('click', function(e) {
		// If the click is on a marker or inside a leaflet popup, do nothing
		if (
			(e.target.closest('.leaflet-marker-icon')) ||
			(e.target.closest('.leaflet-popup'))
		) {
			return;
		}
		if (imageBar && !imageBar.contains(e.target) && imageBarGradient && !imageBarGradient.contains(e.target)) {
			showAllPins();
		}
	}, true);

	// After map is created and before markers are added
	const filmImageBar = document.getElementById('film-image-bar');
	const filmImageBarGradient = document.getElementById('film-image-bar-gradient');
	const filterBarContainer = document.getElementById('filter-bar-container');

	const ORIGINAL_CENTER = [40.76, -73.98];
	const ORIGINAL_ZOOM = 12;

	function hideBottomBar() {
		if (filmImageBar) filmImageBar.classList.add('film-image-bar-hidden');
		if (filmImageBarGradient) filmImageBarGradient.classList.add('film-image-bar-gradient-hidden');
		if (filterBarContainer) filterBarContainer.classList.add('filter-bar-container-hidden');
	}
	function showBottomBar() {
		if (filmImageBar) filmImageBar.classList.remove('film-image-bar-hidden');
		if (filmImageBarGradient) filmImageBarGradient.classList.remove('film-image-bar-gradient-hidden');
		if (filterBarContainer) filterBarContainer.classList.remove('filter-bar-container-hidden');
	}

	map.on('zoomstart', hideBottomBar);
	map.on('zoomend', function() {
		const zoom = map.getZoom();
		// Only show the image bar and gradient if not in Featured mode
		if ($filterFeatured.classList.contains('active')) {
			// Do nothing, keep Featured state
			return;
		}
		if (zoom <= ORIGINAL_ZOOM) {
			if (filmImageBar) filmImageBar.classList.remove('film-image-bar-hidden');
			if (filmImageBarGradient) filmImageBarGradient.classList.remove('film-image-bar-gradient-hidden');
			if (filterBarContainer) filterBarContainer.classList.remove('filter-bar-container-hidden');
		}
	});

	// Show bar when a marker is clicked
	function addShowBarToMarker(marker) {
		marker.on('click', showBottomBar);
	}
	movies.forEach(s => addShowBarToMarker(s.marker));
	tv.forEach(s => addShowBarToMarker(s.marker));
	books.forEach(s => addShowBarToMarker(s.marker));

	// Show bar when an image is clicked
	if (filmImageBar) {
		filmImageBar.querySelectorAll('img').forEach(img => {
			img.addEventListener('click', showBottomBar);
		});
	}

	// Add a reference for the new Featured button
	let $filterFeatured = document.querySelector('#filterFeatured');

	// Helper: get all pins with title cards
	function getFeaturedPins() {
		if (!window.featuredNames) return [];
		let featuredPins = [];
		movies.forEach(s => { if (window.featuredNames.includes(s.name)) featuredPins.push(s); });
		tv.forEach(s => { if (window.featuredNames.includes(s.name)) featuredPins.push(s); });
		books.forEach(s => { if (window.featuredNames.includes(s.name)) featuredPins.push(s); });
		return featuredPins;
	}

	// Featured filter logic
	const filterFeatured = () => {
		$filterTitle.value = "";
		// Hide all markers
		movies.forEach(s => { map.removeLayer(s.marker); });
		tv.forEach(s => { map.removeLayer(s.marker); });
		books.forEach(s => { map.removeLayer(s.marker); });
		// Show only featured pins
		getFeaturedPins().forEach(s => { map.addLayer(s.marker); });
		// Set button styles
		changeButtonStyle($showAll, false);
		changeButtonStyle($filterMovies, false);
		changeButtonStyle($filterTV, false);
		changeButtonStyle($filterBooks, false);
		changeButtonStyle($filterFeatured, true);
		allOn = false;
		moviesOn = false;
		tvOn = false;
		booksOn = false;
		// Show the image bar and gradient if hidden
		if (filmImageBar) filmImageBar.classList.remove('film-image-bar-hidden');
		if (filmImageBarGradient) filmImageBarGradient.classList.remove('film-image-bar-gradient-hidden');
		if (filterBarContainer) filterBarContainer.classList.remove('filter-bar-container-hidden');
	}

	// Add event listener for the Featured button
	if ($filterFeatured) {
		$filterFeatured.addEventListener('click', filterFeatured);
	}
}
