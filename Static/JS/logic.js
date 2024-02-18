// Create a Leaflet map
var map = L.map("map").setView([37.09, -95.71], 4);

// Add a tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Access the GeoJSON data from the provided URL
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
).then((data) => {
  // Create a GeoJSON layer and add it to the map
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 6, // Adjust the marker size based on earthquake magnitude
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      }).bindPopup(
        `<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`
      );
    },
  }).addTo(map);

  // Create a legend control and add it to the map
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    div.style.backgroundColor = "white"; // Set the background color to white
    div.style.padding = "10px"; // Add padding to the legend container
    div.style.borderRadius = "10px"; // Add curved edges to the legend container

    // Add title to the legend
    div.innerHTML = "<h4>Depth Chart</h4>";

    var depths = [0, 10, 30, 50, 70, 90];

    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<div style="display:inline-block; width:20px; height:20px; background:' +
        getColor(depths[i] + 1) +
        '"></div> ' +
        depths[i] +
        (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }

    return div;
  };

  legend.addTo(map);
});

// Function to determine the color based on depth
function getColor(depth) {
  if (depth < 10) {
    return "#00FF00";
  } else if (depth < 30) {
    return "#FFFF00";
  } else if (depth < 50) {
    return "#FFA500";
  } else if (depth < 70) {
    return "#FF4500";
  } else if (depth < 90) {
    return "#FF0000";
  } else {
    return "#8B0000";
  }
}
