const coordinates = campground.geometry.coordinates;
//console.log(coordinates);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v9", // style URL
  //center: [-74.5, 40], // starting position [lng, lat]
  center: coordinates,
  zoom: 10, // starting zoom
  //projection: 'globe' // display the map as a 3D globe
});

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});

map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

//const marker = new mapboxgl.Marker().setLngLat([-74.5, 40]).addTo(map);
const marker = new mapboxgl.Marker()
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map);
