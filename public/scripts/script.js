let checkedFilterBtns = [];
let filter = document.getElementsByClassName("filter-btn");
let searchBtn = document.getElementById("search-btn");
let toySearchTerm = document.getElementById("toy-search");
let locationTerm = document.getElementById("location-search");
let allToys = [];
let currentToys;
let markerPointers = [];

window.onload = getToys;

let map = tt.map({
  key: "8vFjEVbQhOi9xCGGWGnn7zIAjhYX2VPH",
  container: "map",
  style: "tomtom://vector/1/basic-light",
  center: [-73.932789, 40.695839],
  zoom: 12
});
map.addControl(new tt.NavigationControl());

//////////////////////////////////Gets Info from front end and database//////////////////

searchBtn.addEventListener("click", event => {
  if (locationTerm.value) {
    locationSearch();
  }
  toySearch();
});

//Add Event Listener To Filter Buttons
for (let i = 0; i < filter.length; i++) {
  filter[i].addEventListener("click", event => {
    let result = filter[i].name;
    if (checkedFilterBtns.includes(result)) {
      let index = checkedFilterBtns.indexOf(result);
      checkedFilterBtns.splice(index, 1);
    } else {
      checkedFilterBtns.push(result);
    }
    toySearch();
  });
}

// Gets Points from Database
function getToys() {
  allToys = [];
  axios
    .get("/toys")
    .then(res => {
      let toysArr = res.data.toys;
      for (let toy of toysArr) {
        allToys.push(toy);
      }
      getPoints(allToys);
      displaytoys(allToys);
    })
    .catch(error => {
      console.log(error);
    });
}

function toySearch() {
  let arr = [...allToys];
  let final;
  let searchTerm;
  let filterBox;

  if (toySearchTerm.value) {
    searchTerm = arr.filter(toy => {
      if (
        toy.name.toLowerCase().includes(toySearchTerm.value.toLowerCase()) ||
        toy.description
          .toLowerCase()
          .includes(toySearchTerm.value.toLowerCase())
      ) {
        return toy;
      }
    });
  }

  if (checkedFilterBtns.length > 0) {
    filterBox = arr.filter(toy => {
      if (checkedFilterBtns.includes(toy.category)) {
        return toy;
      }
    });
  }
  if (searchTerm && filterBox) {
    let ages = [];
    filterBox.map(toy => {
      ages.push(toy.category);
    });

    final = searchTerm.filter(item => {
      if (ages.includes(item.category)) {
        return item;
      }
    });
  } else if (searchTerm) {
    final = searchTerm;
  } else if (filterBox) {
    final = filterBox;
  } else {
    final = allToys;
  }

  clearMarkers();
  getPoints(final);
  displaytoys(final);
}

function getPoints(arr) {
  arr.map(toy => {
    let latlng = null;
    axios
      .get(
        `https://api.tomtom.com/search/2/geocode/${toy.location}.json?countrySet=US&lat=-73.932789&lon=40.695839&key=8vFjEVbQhOi9xCGGWGnn7zIAjhYX2VPH`
      )
      .then(res => {
        latlng = res.data.results[0].position;
        var marker = new tt.Marker()
          .setLngLat({
            lng: parseFloat(latlng.lon),
            lat: parseFloat(latlng.lat)
          })
          .addTo(map);
        marker.setPopup(new tt.Popup().setHTML(toy.name));
        markerPointers.push(marker);
      })
      .catch(error => {
        console.log(error);
      });
  });
}

function clearMarkers() {
  markerPointers.map(mark => {
    mark.remove();
  });
}

function displaytoys(arr) {
  let container = document.querySelector(".card-row");
  container.innerHTML = "";
  for (let toy of arr) {
    container.innerHTML += `
      <div class="col-sm-4 my-4">
        <div class="card h-100 toy-info shadow-lg">
          <div class="card-body">
            <img class='toyImg card-img-top mb-3' src="${toy.image}" alt="toy">
            <h5 class="card-title font-weight-bold">${toy.name}</h5>
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

// Location Search Option
function locationSearch() {
  axios
    .get(
      `https://api.tomtom.com/search/2/geocode/${locationTerm.value}.json?countrySet=US&lat=-73.932789&lon=40.695839&key=8vFjEVbQhOi9xCGGWGnn7zIAjhYX2VPH`
    )
    .then(res => {
      map.jumpTo({ center: res.data.results[0].position, zoom: 14 });
    })
    .catch(error => {
      console.log(error);
    });
}
