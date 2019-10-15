var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


d3.json(earthquakeURL, function(data) {
  
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

 
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .9,
        color: "#000",
        stroke: true,
        weight: .5
    })
  }
  });

  
  createMap(earthquakes);
}
function createMap(earthquakes) {

    // Adding layers and API key
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1Ijoic2NvYmJ5eTJrMyIsImEiOiJjazA5cGhrOHYwYjRhM2NwcTJua2sybTFsIn0.w7nTa48WFUWwmVNEfcdfYw");
  
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1Ijoic2NvYmJ5eTJrMyIsImEiOiJjazA5cGhrOHYwYjRhM2NwcTJua2sybTFsIn0.w7nTa48WFUWwmVNEfcdfYw");

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1Ijoic2NvYmJ5eTJrMyIsImEiOiJjazA5cGhrOHYwYjRhM2NwcTJua2sybTFsIn0.w7nTa48WFUWwmVNEfcdfYw");
  
    // base layers
     
    var baseMaps = {
      "Outdoors": outdoors,
      "Satellite": satellite,
      "Grayscale": darkmap
    };

    //tectonic plates
    var tectonicPlates = new L.LayerGroup();

    // overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes,
      "Tectonic Plates": tectonicPlates
    };

    // map display

    var myMap = L.map("map", {
      center: [
        40, -75],
      zoom: 3,
      layers: [outdoors, earthquakes, tectonicPlates]
    });

    // tectonic plates line

    d3.json(tectonicPlatesURL, function(plateData) {
  
      L.geoJson(plateData, {
        color: "yellow",
        weight: 2.0
      })
      .addTo(tectonicPlates);
  });

  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
  
        div.innerHTML+='Earthquake Magnitude<br><hr>'
    
        // legend lables
for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
  legend.addTo(myMap);
}
   

function getColor(d) {
    return d < 1 ? 'rgb(255,255,255)' :
          d < 2  ? 'rgb(255,225,225)' :
          d < 3  ? 'rgb(255,195,195)' :
          d < 4  ? 'rgb(255,165,165)' :
          d < 5  ? 'rgb(255,135,135)' :
          d < 6  ? 'rgb(255,105,105)' :
                      'rgb(255,0,0)';
}

  function getRadius(value){
    return value*30000
  }
