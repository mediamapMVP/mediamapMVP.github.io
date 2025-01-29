function navScroll(section) {
  var elem = document.getElementById(section);
  window.scroll(0, elem.offsetTop - 40);
}

document.addEventListener('DOMContentLoaded', init, false);

async function init() {

	let ColorIcon =  L.Icon.extend({
    	options: {
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
			iconSize:     [25, 41],
			shadowSize:   [41, 41],
			iconAnchor:   [12, 41],
			popupAnchor:  [1, -34]
    	}
    });
      
  let greenIcon = new ColorIcon({iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'});
    
  let redIcon = new ColorIcon({iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'});
      
	let blueIcon = new ColorIcon({iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png'});

  let $filterMovies = document.querySelector('#filterMovies');
  let $filterTV = document.querySelector('#filterTV');
  let $filterBooks = document.querySelector('#filterBooks');

  let movies = await getMovies();
  let tv = await getTV();
  let books = await getBooks();

  var map = L.map('map').setView([40.76, -73.98], 12);
  map.attributionControl.setPrefix(false);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  }).addTo(map);

  		
	movies.forEach(s => {
		s.marker = L.marker([s.location.lat, s.location.lng], {icon: redIcon}).addTo(map);
		s.marker.bindPopup(`<b>${s.name}</b><br>${s.description}`);
		
	});

	tv.forEach(s => {
		s.marker = L.marker([s.location.lat, s.location.lng], {icon: blueIcon}).addTo(map);
		s.marker.bindPopup(`<b>${s.name}</b><br>${s.description}`);
		
	});

	books.forEach(s => {
		s.marker = L.marker([s.location.lat, s.location.lng], {icon: greenIcon}).addTo(map);
		s.marker.bindPopup(`<b>${s.name}</b><br>${s.description}`);
		
	});
			
	const filterMovies = () => {
		let filterMovies = $filterMovies.checked;
		
		movies.forEach(s => {
      if(filterMovies) map.addLayer(s.marker);
			else if(map.hasLayer(s.marker)) map.removeLayer(s.marker);;
		});
	};

	$filterMovies.addEventListener('change', filterMovies);

	const filterTV = () => {
		let filterTV = $filterTV.checked;
		
		tv.forEach(s => {
			if(filterTV) map.addLayer(s.marker);
			else if(map.hasLayer(s.marker)) map.removeLayer(s.marker);
		});
	};

	$filterTV.addEventListener('change', filterTV);

	const filterBooks= () => {
		let filterBooks = $filterBooks.checked;
		
		books.forEach(s => {
			if(filterBooks) map.addLayer(s.marker);
			else if(map.hasLayer(s.marker)) map.removeLayer(s.marker);
		});
	};

	$filterBooks.addEventListener('change', filterBooks);

}

async function getMovies() {
	return new Promise(resolve => {
		
		let movies = [
			{ name: "Movie Title", location: { lat:40.7104, lng: -74.0121 }, description: "Description"}
			];
		
		resolve(movies);
	});
}

async function getTV() {
	return new Promise(resolve => {
		
		let tv = [
			{ name: "TV Show Title", location: { lat:40.756378, lng: -73.990639 }, description: "Description"}
			];
		
		resolve(tv);
	});
}

async function getBooks() {
	return new Promise(resolve => {
		
		let books = [
			{ name: "Book Title", location: { lat:40.713134, lng: -73.939713 }, description: "Description"}
			];
		
		resolve(books);
	});
}


