// const locationsAvailable = document.getElementById('locationList');

let markers = [];
let mapMarker = [];

let mapContainer = document.getElementById("map");
let container = document.querySelector(".row");
let filter = document.getElementsByClassName("filter-btn");

//Add Event Listener
for (let i = 0; i < filter.length; i++) {
  filter[i].addEventListener("click", event => {
    console.log(filter[i].name);
    let result = filter[i].name;
    clearMarkers();
    markers = [];
    mapMarker = [];
    gettoys(result);
  });
}

// Gets Markers from Database
function gettoys(result) {
  axios
    .get("/toys")
    .then(res => {
      let toysArr = res.data.toys;
      if (!result) {
        for (let toy of toysArr) {
          markers.push(toy);
        }
        toytoys(markers);
      } else {
        toysArr.filter(toy => {
          if (
            toy.category
              .toLowerCase()
              .split(" ")
              .join("") === result
          )
            markers.push(toy);
        });
        toytoys();
      }
    })
    .catch(error => {
      console.log(error);
    });
}

let map;
function init() {
  map = new google.maps.Map(mapContainer, {
    center: { lat: 40.695839, lng: -73.932789 },
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullScreenControl: false,
    styles: mapStyles
  });
}

function clearMarkers() {
  setMapOnAll(null);
}

function setMapOnAll(map) {
  for (var i = 0; i < mapMarker.length; i++) {
    mapMarker[i].setMap(map);
  }
}

function toytoys() {
  markers.forEach(function(toy) {
    const splitLoc = toy.location.split(",");
    const center = {
      lat: parseFloat(splitLoc[0]),
      lng: parseFloat(splitLoc[1])
    };
    const marker = new google.maps.Marker({
      position: center,
      map: map,
      label: { text: toy.name, color: "white" },
      icon: {
        scaledSize: new google.maps.Size(30, 50),
        labelOrigin: new google.maps.Point(16, 55),
        url: "/images/icon.png"
      }
    });
    mapMarker.push(marker);
  });
  displaytoys();
}

function displaytoys() {
  container.innerHTML = "";
  for (let toy of markers) {
    container.innerHTML += `
    <div class="col-sm-4 my-4">
      <div class="card h-100 toy-info shadow-lg">
        <div class="card-body">
          <img class='toyImg card-img-top mb-3' src="${
            toy.image
          }" alt="toy">
          <h5 class="card-title toyName font-weight-bold">${toy.name}</h5>
           <p class="toyDescription card-text">${toy.description.substring(
             0,
             100
           ) + " . . ."}</p>
           <a class="text-info" href="toyDetail/${toy._id}">See More</a>
      </div>
    </div>
    </div>`;
  }
}

gettoys();
