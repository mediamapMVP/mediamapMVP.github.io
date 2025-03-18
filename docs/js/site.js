document.addEventListener('DOMContentLoaded', init, false);

async function init() {

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

	let $showAll = document.querySelector('#showAll');
	let $filterMovies = document.querySelector('#filterMovies');
	let $filterTV = document.querySelector('#filterTV');
	let $filterBooks = document.querySelector('#filterBooks');
	let $filterTitle = document.querySelector('#filterTitle');
	let $suggestionsBox = document.querySelector("#suggestions");
	
	let $addBtn = document.querySelector('#addBtn');

	let filterTitleValue = "";

	$addBtn.addEventListener("mouseover", function() {
		if ($filterTitle.value != "") {
			filterTitleValue = $filterTitle.value;
			$filterTitle.value = "";
		}

		$addBtn.focus();
	});

	let $followBtn = document.querySelector('#followBtn');
	$followBtn.addEventListener("mouseover", function() {
		if ($filterTitle.value != "") {
			filterTitleValue = $filterTitle.value;
			$filterTitle.value = "";
		}
	});

	let $titleField= document.querySelector('#title');
	let $descField = document.querySelector('#description');
	let $commentsField = document.querySelector('#comments');

	let $filterTitleDiv = document.querySelector('#filterTitleDiv');

	$filterTitleDiv.addEventListener("mouseover", function() {
		$addBtn.blur();
		$titleField.blur();
		$descField.blur();
		$commentsField.blur();

		if (filterTitleValue != "") {
			$filterTitle.value = filterTitleValue;
			filterTitleValue = "";
		}
	});

	let $addForm = document.querySelector('#addForm');
	$addForm.addEventListener("mouseleave", function() {
		$addBtn.focus();
	});

	if (window.innerWidth < 450) {
		$filterBooks.innerHTML = "BOOKS";
	}

	let movies = await getMovies();
	let tv = await getTV();
	let books = await getBooks();

	var map = L.map('map', {
		zoomControl: false
	}).setView([40.76, -73.98], 12);
	map.attributionControl.setPrefix(false);

	L.tileLayer('https://api.mapbox.com/styles/v1/mediamapmvp/cm6sgz4dy016201ry1r0o6c1q/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWVkaWFtYXBtdnAiLCJhIjoiY202cHpqNHR2MTZmMDJycTB1YzkzaDk2MCJ9.0J87bgTD7XKdBP5NH07wuA', {
	}).addTo(map);

	var customPopupOptions = {
		'maxWidth': 400,
		'width': 200,
		'className': 'popupCustom'
	}

	movies.forEach(s => {

		s.marker = L.marker([s.location.lat, s.location.lng], { icon: blackIcon }).addTo(map);

		if (s.filming_location) {
			let customPopupContent = `<h2>${s.name} (${s.year}), <i>${s.location_title}</i></h2><p>${s.filming_location}, ${s.filming_address}</p>`;
			s.marker.bindPopup(customPopupContent, customPopupOptions);

		}
		else {
			let customPopupContent = `<h2>${s.name} (${s.year}), <i>${s.location_title}</i></h2><p>${s.filming_address}</p>`;
			s.marker.bindPopup(customPopupContent, customPopupOptions);
		}
	});

	tv.forEach(s => {
		s.marker = L.marker([s.location.lat, s.location.lng], { icon: blackIcon }).addTo(map);

		if (s.fictional_name) {
			let customPopupContent = `<h2>${s.name} (S${s.season} E${s.episode}), <i>${s.location_title}</i></h2><p>${s.fictional_name}, ${s.filming_location}</p>`;
			s.marker.bindPopup(customPopupContent, customPopupOptions);

		}
		else {
			let customPopupContent = `<h2>${s.name} (S${s.season} E${s.episode}), <i>${s.location_title}</i></h2><p>${s.filming_location}</p>`;
			s.marker.bindPopup(customPopupContent, customPopupOptions);
		};

	});

	books.forEach(s => {
		s.marker = L.marker([s.location.lat, s.location.lng], { icon: blackIcon }).addTo(map);

		let customPopupContent = `<h2>${s.name}</h2><p>${s.description}</p>`

		s.marker.bindPopup(customPopupContent, customPopupOptions);

	});

	let allOn = true;
	let moviesOn = false;
	let tvOn = false;
	let booksOn = false;

	const changeButtonStyle = (elem, turnOn) => {
		if (turnOn) {
			elem.style.backgroundColor = "#000000";
			elem.style.color = "#d7d26a";
		}
		else {
			elem.style.backgroundColor = "#d7d26a";
			elem.style.color = "#000000";
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


					allOn = true;
					moviesOn = false;
					tvOn = false;
					booksOn = false;
				}
				else {
					moviesOn = true;
					changeButtonStyle($filterMovies, true);
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

					allOn = true;
					moviesOn = false;
					tvOn = false;
					booksOn = false;
				}
				else {
					tvOn = true;
					changeButtonStyle($filterTV, true);
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

					allOn = true;
					moviesOn = false;
					tvOn = false;
					booksOn = false;
				}
				else {
					booksOn = true;
					changeButtonStyle($filterBooks, true);
				}
			}
		}
	};

	$filterBooks.addEventListener('click', filterBooks);

	const filterTitle = () => {

		let term = $filterTitle.value.toLowerCase().trim();
		// console.log(`Filter to term: ${term}`);

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
		allOn = false;
		moviesOn = false;
		tvOn = false;
		booksOn = false;

		if (term === '') {
			changeButtonStyle($showAll, true);
			changeButtonStyle($filterMovies, false);
			changeButtonStyle($filterTV, false);
			changeButtonStyle($filterBooks, false);

			allOn = true;
			moviesOn = false;
			tvOn = false;
			booksOn = false;
		}

	};

	$filterTitle.addEventListener('input', filterTitle);



	let mediaNames = [
		"When Harry Met Sally",
		"Breakfast at Tiffany's",
		"Spider-Man",
		"Sex and The City",
		"Book Title"
	]

	function showSuggestions(list) {
		let listData;
		if (!list.length) {
			userValue = $filterTitle.value;
			listData = '<li>'+ userValue +'</li>';
		}
		else {
			listData = list.join('');
		}
		$suggestionsBox.innerHTML = listData;
	}

	const useSuggestion = (elem) => {
		console.log(elem)
		$filterTitle.value = elem.innerHTML;
		$suggestionsBox.innerHTML = '<li>' + elem.innerHTML + '</li>';
		$suggestionsBox.style = "display: none;";
		filterTitle();
	}
	
	$filterTitle.onkeyup = (e)=>{
		let userData = e.target.value;
		let suggestions = [];
		if (userData) {
			suggestions = mediaNames.filter((data)=>{
				return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()); 
			});

			if (suggestions.length > 5)
				suggestions = suggestions.slice(0, 5);

			suggestions = suggestions.map((data)=>{
				return data = '<li>'+ data +'</li>';
			});
			showSuggestions(suggestions);
			let suggestionsElems = $suggestionsBox.querySelectorAll("li");
			for (let i = 0; i < suggestionsElems.length; i++) {
				suggestionsElems[i].addEventListener("click", function() {useSuggestion(suggestionsElems[i])});
			}

			$filterTitle.style = "border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
		}
		else {
			$suggestionsBox.innerHTML = '';
			$filterTitle.style = '';
		}
	}
	$filterTitle.addEventListener('focusin', function() {
		$suggestionsBox.style = "display: block;";
		if ($suggestionsBox.innerHTML != '')
			$filterTitle.style = "border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
	});

	$filterTitle.addEventListener('focusout', function() {
		$suggestionsBox.style = "display: none;";
		$filterTitle.style = '';
	});
	
	$filterTitle.addEventListener('input', function(event) {
		if (!event.target.value) {
			$suggestionsBox.innerHTML = '';
			$suggestionsBox.style = "display: none;";
			$filterTitle.style = '';
		}
	});


	async function getMovies() {
		return new Promise(resolve => {
	
			let movies = [
				{ name: "When Harry Met Sally", year: "1989", location_title: "The Loeb Boathouse", filming_location: "", filming_address: "East 72nd St & Park Drive North", location: { lat: 40.7759146174992, lng: -73.9687424456909 } },
				{ name: "When Harry Met Sally", year: "1989", location_title: "Shakespeare & Co Bookstore", filming_location: "", filming_address: "2736 Broadway", location: { lat: 40.8008847840792, lng: -73.9677204456737 } },
				{ name: "When Harry Met Sally", year: "1989", location_title: "Temple of Dendur", filming_location: "The Metropolitan Museum of Art", filming_address: "1000 5th Ave", location: { lat: 40.7799265917991, lng: -73.9633825456881 } },
				{ name: "When Harry Met Sally", year: "1989", location_title: "Coney Island Batting Cages", filming_location: "Luna Park", filming_address: "1000 Surf Ave", location: { lat: 40.574450282601, lng: -73.9802654458295 } },
				{ name: "When Harry Met Sally", year: "1989", location_title: "Katz's Delicatessen", filming_location: "", filming_address: "205 E Houston St", location: { lat: 40.7228630351169, lng: -73.9873959610711 } },
				{ name: "When Harry Met Sally", year: "1989", location_title: "Café Luxembourg", filming_location: "", filming_address: "200 W. 70th St", location: { lat: 40.7780929915091, lng: -73.9830366150022 } },
				{ name: "When Harry Met Sally", year: "1989", location_title: "The Puck Building", filming_location: "", filming_address: "95 Lafayette St", location: { lat: 40.7179344654344, lng: -74.0011245150434 } },
				{ name: "When Harry Met Sally", year: "1989", location_title: "JFK Airport", filming_location: "", filming_address: "", location: { lat: 40.6435987081949, lng: -73.779373445782 } },
				{ name: "When Harry Met Sally", year: "1989", location_title: "Washington Square Park", filming_location: "", filming_address: "Washington Square", location: { lat: 40.7317080497967, lng: -73.9977289917525 } },
				{ name: "Breakfast At Tiffany's ", year: "1961", location_title: "Holly Golightly's Apartment", filming_location: "", filming_address: "169 East 71st St", location: { lat: 40.7703128730184, lng: -73.9620091763822 } },
				{ name: "Breakfast At Tiffany's ", year: "1961", location_title: "Tiffany & Co.", filming_location: "", filming_address: "727 5th Ave", location: { lat: 40.7632777287863, lng: -73.9737856996687 } },
				{ name: "Breakfast At Tiffany's ", year: "1961", location_title: "Conservatory Water", filming_location: "Central Park", filming_address: "E 72nd St", location: { lat: 40.7699709766982, lng: -73.9591705536333 } },
				{ name: "Spider-Man", year: "2002", location_title: "Peter Parker's Home", filming_location: "", filming_address: "8839 69th Road", location: { lat: 40.7103513875776, lng: -73.8550677895564 } },
				{ name: "Spider-Man", year: "2002", location_title: "Mary Jane's Home", filming_location: "", filming_address: "8837 69th Road", location: { lat: 40.7102970005606, lng: -73.8550892472282 } },
				{ name: "Spider-Man", year: "2002", location_title: "Moondance Diner", filming_location: "", filming_address: "80 Sixth Ave", location: { lat: 40.7191237113779, lng: -74.0051795764172 } },
				{ name: "Spider-Man", year: "2002", location_title: "Norman Osborn’s Apartment", filming_location: "", filming_address: "Tudor City", location: { lat: 40.7492078526597, lng: -73.9713460303657 } },
				{ name: "Spider-Man", year: "2002", location_title: "Rockefeller Roof Gardens", filming_location: "", filming_address: "50 Rockefeller Plaza", location: { lat: 40.7600124509936, lng: -73.9784229303582 } },
				{ name: "Spider-Man", year: "2002", location_title: "The Daily Bugle Offices", filming_location: "Flatiron Building", filming_address: "175 Fifth Ave", location: { lat: 40.7419719163523, lng: -73.9894589764016 } },
				{ name: "Spider-Man", year: "2002", location_title: "Columbia University", filming_location: "Low Memorial Library", filming_address: "535 W. 116th St", location: { lat: 40.8085654470388, lng: -73.9622364223866 } },
				{ name: "Spider-Man", year: "2002", location_title: "Queensboro Bridge", filming_location: "", filming_address: "", location: { lat: 40.7576806780678, lng: -73.9549173763908 } },
				{ name: "Spider-Man", year: "2002", location_title: "Time's Square", filming_location: "", filming_address: "45th St and 7th Ave", location: { lat: 40.7581047288972, lng: -73.985553328855 } },
			];
			resolve(movies);
		});
	}
	
	async function getTV() {
		return new Promise(resolve => {
	
			let tv = [
				{ name: "Sex and The City", season: "1", episode: "1", episode_title: "Sex and The City", location_title: "Carrie's Apartment", fictional_name: "245 East 73rd Street", filming_location: "64 Perry St", location: { lat: 40.735481262207, lng: -74.0036239624023 } },
				{ name: "Sex and The City", season: "1", episode: "6", episode_title: "Secret Sex", location_title: "Charlotte's Gallery", fictional_name: "Louis K. Meisel Gallery", filming_location: "141 Prince St", location: { lat: 40.7263600228213, lng: -74.0004667303815 } },
				{ name: "Sex and The City", season: "1", episode: "12", episode_title: "Oh Come All Ye Faithful", location_title: "Big's Church", fictional_name: "St. Patrick’s Cathedral", filming_location: "631 5th Ave", location: { lat: 40.7588221396094, lng: -73.9777057377645 } },
				{ name: "Sex and The City", season: "2", episode: "1", episode_title: "Take Me Out To The Ballgame", location_title: "Yankee Stadium", fictional_name: "", filming_location: "1 E 161st St", location: { lat: 40.8301668394032, lng: -73.9265641609972 } },
				{ name: "Sex and The City", season: "2", episode: "8", episode_title: "The Man, the Myth, the Viagra", location_title: "Steve's Bar", fictional_name: "", filming_location: "174 Grand St", location: { lat: 40.7202156818028, lng: -73.9981601531348 } },
				{ name: "Sex and The City", season: "2", episode: "18", episode_title: "Ex and the City", location_title: "Big and Natasha’s engagement party", fictional_name: "The Plaza Hotel", filming_location: "768 5th Ave", location: { lat: 40.7650444132297, lng: -73.9745370610421 } },
				{ name: "Sex and The City", season: "3", episode: "1", episode_title: "Where There’s Smoke…", location_title: "Staten Island Ferry", fictional_name: "", filming_location: "", location: { lat: 40.6746607, lng: -74.0464153 } },
				{ name: "Sex and The City", season: "3", episode: "5", episode_title: "No Ifs, Ands, or Butts", location_title: "Magnolia Bakery", fictional_name: "", filming_location: "401 Bleecker St", location: { lat: 40.7364077291706, lng: -74.005128791749 } },
				{ name: "Sex and The City", season: "3", episode: "15", episode_title: "Hot Child In The City", location_title: "St. Mark's Comics", fictional_name: "", filming_location: "51 35th St", location: { lat: 40.6577080139172, lng: -74.0074062764596 } },
				{ name: "Sex and The City", season: "3", episode: "18", episode_title: "Cock-a-Doodle-Do", location_title: "The Loeb Boathouse", fictional_name: "", filming_location: "East 72nd St & Park Drive North", location: { lat: 40.7757846234208, lng: -73.9686566150037 } },
				{ name: "Sex and The City", season: "6", episode: "8", episode_title: "The Catch", location_title: "Trapeze School", fictional_name: "", filming_location: "353 West St", location: { lat: 40.7295621470108, lng: -74.0104517457229 } },
				{ name: "Sex and The City", season: "6", episode: "10", episode_title: "Boy, Interrupted", location_title: "SoHo House ", fictional_name: "", filming_location: "29-35 9th Ave", location: { lat: 40.7408637625762, lng: -74.005880045715 } },
				{ name: "Sex and The City", season: "6", episode: "14", episode_title: "The Ick Factor", location_title: "Miranda and Steve's wedding venue", fictional_name: "Jefferson Market Garden", filming_location: "10 Greenwich Ave", location: { lat: 40.7350613584297, lng: -73.9996162996881 } },
			];
	
			resolve(tv);
		});
	}
	
	async function getBooks() {
		return new Promise(resolve => {
	
			let books = [
				{ name: "Book Title", description: "Author and whatnot", location: { lat: 40.713135, lng: -73.939713 } },
			];
	
			resolve(books);
		});
	}
}
