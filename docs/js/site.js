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
  let $filterTitle = document.querySelector('#filterTitle');

  let movies = await getMovies();
  let tv = await getTV();
  let books = await getBooks();

  var map = L.map('map').setView([40.76, -73.98], 12);
  map.attributionControl.setPrefix(false);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  }).addTo(map);

  		
	movies.forEach(s => {
    s.marker = L.marker([s.location.lat, s.location.lng], {icon: redIcon}).addTo(map);
    if(s.filming_location) 
		  s.marker.bindPopup(`<h6>${s.name} (${s.year})</h6><i>${s.location_title}</i><br><br>${s.filming_location}, ${s.filming_address}`);
		else(s.marker.bindPopup(`<h6>${s.name} (${s.year})</h6><i>${s.location_title}</i><br><br>${s.filming_address}`));
	});

	tv.forEach(s => {
    s.marker = L.marker([s.location.lat, s.location.lng], {icon: blueIcon}).addTo(map);
    if(s.fictional_name) 
		  s.marker.bindPopup(`<h6>${s.name}</h6><i>S${s.season}# E${s.episode}#: ${s.episode_title} // ${s.location_title}</i><br><br>${s.fictional_name}, ${s.filming_location}`);
    else (s.marker.bindPopup(`<h6>${s.name}</h6><i>S${s.season}# E${s.episode}#: ${s.episode_title} // ${s.location_title}</i><br><br>${s.filming_location}`));
		
	});

	books.forEach(s => {
		s.marker = L.marker([s.location.lat, s.location.lng], {icon: greenIcon}).addTo(map);
		s.marker.bindPopup(`<h6>${s.name}</h6>${s.description}`);
		
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
  
  const filterTitle = () => {

		let term = $filterTitle.value.toLowerCase().trim();
		console.log(`Filter to term: ${term}`);
		
		movies.forEach(s => {
			if(
					(term !== '' && s.name.toLowerCase().indexOf(term) === -1)
			) map.removeLayer(s.marker);
			else if(!map.hasLayer(s.marker)) map.addLayer(s.marker);
    });
    tv.forEach(s => {
			if(
					(term !== '' && s.name.toLowerCase().indexOf(term) === -1)
			) map.removeLayer(s.marker);
			else if(!map.hasLayer(s.marker)) map.addLayer(s.marker);
    });
    books.forEach(s => {
			if(
					(term !== '' && s.name.toLowerCase().indexOf(term) === -1)
			) map.removeLayer(s.marker);
			else if(!map.hasLayer(s.marker)) map.addLayer(s.marker);
		});
	};

	$filterTitle.addEventListener('input', filterTitle);

}

async function getMovies() {
	return new Promise(resolve => {
		
		let movies = [
      {name:"When Harry Met Sally", year:"1989", location_title:"The Loeb Boathouse", filming_location :"", filming_address: "East 72nd St & Park Drive North", location: {lat:40.7759146174992,lng:-73.9687424456909}},
      {name:"When Harry Met Sally", year:"1989", location_title:"Shakespeare & Co Bookstore", filming_location :"", filming_address: "2736 Broadway", location: {lat:40.8008847840792,lng:-73.9677204456737}},
      {name:"When Harry Met Sally", year:"1989", location_title:"Temple of Dendur", filming_location :"The Metropolitan Museum of Art", filming_address: "1000 5th Ave", location: {lat:40.7799265917991,lng:-73.9633825456881}},
      {name:"When Harry Met Sally", year:"1989", location_title:"Coney Island Batting Cages", filming_location :"Luna Park", filming_address: "1000 Surf Ave", location: {lat:40.574450282601,lng:-73.9802654458295}},
      {name:"When Harry Met Sally", year:"1989", location_title:"Katz's Delicatessen", filming_location :"", filming_address: "205 E Houston St", location: {lat:40.7228630351169,lng:-73.9873959610711}},
      {name:"When Harry Met Sally", year:"1989", location_title:"Café Luxembourg", filming_location :"", filming_address: "200 W. 70th St", location: {lat:40.7780929915091,lng:-73.9830366150022}},
      {name:"When Harry Met Sally", year:"1989", location_title:"The Puck Building", filming_location :"", filming_address: "95 Lafayette St", location: {lat:40.7179344654344,lng:-74.0011245150434}},
      {name:"When Harry Met Sally", year:"1989", location_title:"JFK Airport", filming_location :"", filming_address: "", location: {lat:40.6435987081949,lng:-73.779373445782}},
      {name:"When Harry Met Sally", year:"1989", location_title:"Washington Square Park", filming_location :"", filming_address: "Washington Square", location: {lat:40.7317080497967,lng:-73.9977289917525}},
      {name:"Breakfast At Tiffany's ", year:"1961", location_title:"Holly Golightly's Apartment", filming_location :"", filming_address: "169 East 71st St", location: {lat:40.7703128730184,lng:-73.9620091763822}},
      {name:"Breakfast At Tiffany's ", year:"1961", location_title:"Tiffany & Co.", filming_location :"", filming_address: "727 5th Ave", location: {lat:40.7632777287863,lng:-73.9737856996687}},
      {name:"Breakfast At Tiffany's ", year:"1961", location_title:"Conservatory Water", filming_location :"Central Park", filming_address: "E 72nd St", location: {lat:40.7699709766982,lng:-73.9591705536333}},
      {name:"Spiderman", year:"2002", location_title:"Peter Parker's Home", filming_location :"", filming_address: "8839 69th Road", location: {lat:40.7103513875776,lng:-73.8550677895564}},
      {name:"Spiderman", year:"2002", location_title:"Mary Jane's Home", filming_location :"", filming_address: "8837 69th Road", location: {lat:40.7102970005606,lng:-73.8550892472282}},
      {name:"Spiderman", year:"2002", location_title:"Moondance Diner", filming_location :"", filming_address: "80 Sixth Ave", location: {lat:40.7191237113779,lng:-74.0051795764172}},
      {name:"Spiderman", year:"2002", location_title:"Norman Osborn’s Apartment", filming_location :"", filming_address: "Tudor City", location: {lat:40.7492078526597,lng:-73.9713460303657}},
      {name:"Spiderman", year:"2002", location_title:"Rockefeller Roof Gardens", filming_location :"", filming_address: "50 Rockefeller Plaza", location: {lat:40.7600124509936,lng:-73.9784229303582}},
      {name:"Spiderman", year:"2002", location_title:"The Daily Bugle Offices", filming_location :"Flatiron Building", filming_address: "175 Fifth Ave", location: {lat:40.7419719163523,lng:-73.9894589764016}},
      {name:"Spiderman", year:"2002", location_title:"Columbia University", filming_location :"Low Memorial Library", filming_address: "535 W. 116th St", location: {lat:40.8085654470388,lng:-73.9622364223866}},
      {name:"Spiderman", year:"2002", location_title:"Queensboro Bridge", filming_location :"", filming_address: "", location: {lat:40.7576806780678,lng:-73.9549173763908}},
      {name:"Spiderman", year:"2002", location_title:"Time's Square", filming_location :"", filming_address: "45th St and 7th Ave", location: {lat:40.7581047288972,lng:-73.985553328855}},   
    ];
		resolve(movies);
	});
}

async function getTV() {
	return new Promise(resolve => {
		
		let tv = [
      {name:"Sex and The City", season:"1", episode:"1", episode_title:"Sex and The City", location_title:"Carrie's Apartment", fictional_name:"245 East 73rd Street", filming_location:"64 Perry St", location: {lat:40.735481262207,lng:-74.0036239624023}},
      {name:"Sex and The City", season:"1", episode:"6", episode_title:"Secret Sex", location_title:"Charlotte's Gallery", fictional_name:"Louis K. Meisel Gallery", filming_location:"141 Prince St", location: {lat:40.7263600228213,lng:-74.0004667303815}},
      {name:"Sex and The City", season:"1", episode:"12", episode_title:"Oh Come All Ye Faithful", location_title:"Big's Church", fictional_name:"St. Patrick’s Cathedral", filming_location:"631 5th Ave", location: {lat:40.7588221396094,lng:-73.9777057377645}},
      {name:"Sex and The City", season:"2", episode:"1", episode_title:"Take Me Out To The Ballgame", location_title:"Yankee Stadium", fictional_name:"", filming_location:"1 E 161st St", location: {lat:40.8301668394032,lng:-73.9265641609972}},
      {name:"Sex and The City", season:"2", episode:"8", episode_title:"The Man, the Myth, the Viagra", location_title:"Steve's Bar", fictional_name:"", filming_location:"174 Grand St", location: {lat:40.7202156818028,lng:-73.9981601531348}},
      {name:"Sex and The City", season:"2", episode:"18", episode_title:"Ex and the City", location_title:"Big and Natasha’s engagement party", fictional_name:"The Plaza Hotel", filming_location:"768 5th Ave", location: {lat:40.7650444132297,lng:-73.9745370610421}},
      {name:"Sex and The City", season:"3", episode:"1", episode_title:"Where There’s Smoke…", location_title:"Staten Island Ferry", fictional_name:"", filming_location:"", location: {lat:40.6746607,lng:-74.0464153}},
      {name:"Sex and The City", season:"3", episode:"5", episode_title:"No Ifs, Ands, or Butts", location_title:"Magnolia Bakery", fictional_name:"", filming_location:"401 Bleecker St", location: {lat:40.7364077291706,lng:-74.005128791749}},
      {name:"Sex and The City", season:"3", episode:"15", episode_title:"Hot Child In The City", location_title:"St. Mark's Comics", fictional_name:"", filming_location:"51 35th St", location: {lat:40.6577080139172,lng:-74.0074062764596}},
      {name:"Sex and The City", season:"3", episode:"18", episode_title:"Cock-a-Doodle-Do", location_title:"The Loeb Boathouse", fictional_name:"", filming_location:"East 72nd St & Park Drive North", location: {lat:40.7757846234208,lng:-73.9686566150037}},
      {name:"Sex and The City", season:"6", episode:"8", episode_title:"The Catch", location_title:"Trapeze School", fictional_name:"", filming_location:"353 West St", location: {lat:40.7295621470108,lng:-74.0104517457229}},
      {name:"Sex and The City", season:"6", episode:"10", episode_title:"Boy, Interrupted", location_title:"SoHo House ", fictional_name:"", filming_location:"29-35 9th Ave", location: {lat:40.7408637625762,lng:-74.005880045715}},
      {name:"Sex and The City", season:"6", episode:"14", episode_title:"The Ick Factor", location_title:"Miranda and Steve's wedding venue", fictional_name:"Jefferson Market Garden", filming_location:"10 Greenwich Ave", location: {lat:40.7350613584297,lng:-73.9996162996881}},
    ];
		
		resolve(tv);
	});
}

async function getBooks() {
	return new Promise(resolve => {
		
		let books = [
      { name: "Book Title", description:"Author and whatnot", location: { lat:40.713135, lng: -73.939713 }},
			];
		
		resolve(books);
	});
}


