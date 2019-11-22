var map = tt.map({
  key: "8vFjEVbQhOi9xCGGWGnn7zIAjhYX2VPH",
  container: "map",
  style: "tomtom://vector/1/basic-main",
  center: [-73.932789, 40.695839],
  zoom: 10
});

map.addControl(new tt.NavigationControl());

var marker = new tt.Marker().setLngLat([-122.492544, 37.768454]).addTo(map);
marker.setPopup(new tt.Popup().setHTML("my marker"));

//////////////////////////////////Gets Info from front end and database//////////////////
let checkedFilterBtns = [];
let markers = [];
let filter = document.getElementsByClassName("filter-btn");

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
    gettoys();
  });
}

// Gets Points from Database
function gettoys() {
  axios
    .get("/toys")
    .then(res => {
      let toysArr = res.data.toys;
      if (checkedFilterBtns.length === 0) {
        for (let toy of toysArr) {
          markers.push(toy);
        }
      } else {
        toysArr.filter(toy => {
          if (checkedFilterBtns.includes(toy.category)) markers.push(toy);
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
}
//////////////////////////////////////////////

// tt.services
//   .fuzzySearch({
//     key: "8vFjEVbQhOi9xCGGWGnn7zIAjhYX2VPH",
//     query: "11221"
//   })
//   .go()
//   .then(function(response) {
//     for (var i = 0; i < response.results.length; i++) {
//       new tt.Marker().setLngLat(response.results[i].position).addTo(map);
//     }
//   });

// // const locationsAvailable = document.getElementById('locationList');

// let markers = [];
// let mapMarker = [];

// let mapContainer = document.getElementById("map");
// let container = document.querySelector(".row");
// let filter = document.getElementsByClassName("filter-btn");
// let checkedFilterBtns = [];

// //Add Event Listener
// for (let i = 0; i < filter.length; i++) {
//   filter[i].addEventListener("click", event => {
//     let result = filter[i].name;

//     if (checkedFilterBtns.includes(result)) {
//       let index = checkedFilterBtns.indexOf(result);
//       checkedFilterBtns.splice(index, 1);
//     } else {
//       checkedFilterBtns.push(result);
//     }
//     clearMarkers();
//     markers = [];
//     mapMarker = [];
//     gettoys();
//   });
// }

// // Gets Markers from Database
// function gettoys() {
//   axios
//     .get("/toys")
//     .then(res => {
//       let toysArr = res.data.toys;
//       if (checkedFilterBtns.length === 0) {
//         for (let toy of toysArr) {
//           markers.push(toy);
//         }
//         toytoys(markers);
//       } else {
//         toysArr.filter(toy => {
//           if (checkedFilterBtns.includes(toy.category)) markers.push(toy);
//         });
//         toytoys();
//       }
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

// let map;
// function init() {
//   map = new google.maps.Map(mapContainer, {
//     center: { lat: 40.695839, lng: -73.932789 },
//     zoom: 13,
//     mapTypeControl: false,
//     streetViewControl: false,
//     fullScreenControl: false,
//     styles: mapStyles
//   });
// }

// function clearMarkers() {
//   setMapOnAll(null);
// }

// function setMapOnAll(map) {
//   for (var i = 0; i < mapMarker.length; i++) {
//     mapMarker[i].setMap(map);
//   }
// }

// function toytoys() {
//   markers.forEach(function(toy) {
//     const splitLoc = toy.location.split(",");
//     const center = {
//       lat: parseFloat(splitLoc[0]),
//       lng: parseFloat(splitLoc[1])
//     };
//     const marker = new google.maps.Marker({
//       position: center,
//       map: map,
//       label: { text: toy.name, color: "white" }
//     });
//     mapMarker.push(marker);
//   });
//   displaytoys();
// }

// function displaytoys() {
//   container.innerHTML = "";
//   for (let toy of markers) {
//     container.innerHTML += `
//     <div class="col-sm-4 my-4">
//       <div class="card h-100 toy-info shadow-lg">
//         <div class="card-body">
//           <img class='toyImg card-img-top mb-3' src="${toy.image}" alt="toy">
//           <h5 class="card-title font-weight-bold">${toy.name}</h5>
//            <p class="toyDescription card-text">${toy.description.substring(
//              0,
//              100
//            ) + " . . ."}</p>
//            <a class="text-info" href="toyDetail/${toy._id}">See More</a>
//       </div>
//     </div>
//     </div>`;
//   }
// }

// gettoys();
