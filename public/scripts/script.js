let checkedFilterBtns = [];
let filter = document.getElementsByClassName("filter-btn");
let currentToys = [];
let markerPointers = [];

window.onload = function() {
  getToys();
};

let map = tt.map({
  key: "8vFjEVbQhOi9xCGGWGnn7zIAjhYX2VPH",
  container: "map",
  style: "tomtom://vector/1/basic-main",
  center: [-73.932789, 40.695839],
  zoom: 10
});
map.addControl(new tt.NavigationControl());
//////////////////////////////////Gets Info from front end and database//////////////////

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
    getToys();
  });
}

// Gets Points from Database
function getToys() {
  currentToys = [];
  axios
    .get("/toys")
    .then(res => {
      let toysArr = res.data.toys;
      if (checkedFilterBtns.length === 0) {
        for (let toy of toysArr) {
          currentToys.push(toy);
        }
        getPoints();
      } else {
        clearMarkers();
        toysArr.filter(toy => {
          if (checkedFilterBtns.includes(toy.category)) currentToys.push(toy);
        });
        getPoints();
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function getPoints() {
  currentToys.map(toy => {
    var marker = new tt.Marker()
      .setLngLat({ lng: parseFloat(toy.lat), lat: parseFloat(toy.lng) })
      .addTo(map);
    marker.setPopup(new tt.Popup().setHTML(toy.name));
    markerPointers.push(marker);
  });
}

function clearMarkers() {
  markerPointers.map(mark => {
    mark.remove();
  });
}
