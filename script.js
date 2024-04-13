  var map = new ol.Map({
    target: 'map',
    layers: [
       new ol.layer.Tile({
         source: new ol.source.OSM()
       }),
  
      new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: 'http://localhost:8080/geoserver/PANRUTI/wms?service=WMS&version=1.1.0&request=GetMap&layers=PANRUTI%3ANDVI_Panruti&bbox=79.54680655559616%2C11.745113013749094%2C79.56252707306825%2C11.752569030607287&width=768&height=364&srs=EPSG%3A4326&styles=&format=application/openlayers',
          params: { 'LAYERS': 'PANRUTI:NDVI_Panruti', 'TILED': true },
          serverType: 'geoserver'
        })
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([79.55449,11.74949]),
      zoom: 15
    }),
    controls: ol.control.defaults({
      attributionOptions: {
        collapsible: false
      }
    }).extend([
      new ol.control.ZoomSlider(),
      new ol.control.FullScreen()
    ])
  });

  var mousePositionElement = document.createElement('div');
  mousePositionElement.style.position = 'absolute';
  mousePositionElement.style.bottom = '10px';
  mousePositionElement.style.left = '10px';
  mousePositionElement.style.padding = '5px';
  mousePositionElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  mousePositionElement.innerText = 'Coordinates: ';
  map.getViewport().appendChild(mousePositionElement);
  

  function formatCoord(value) {
    return value.toFixed(4);
  }
  

  map.on('pointermove', function(event) {
    var coordinates = ol.proj.toLonLat(event.coordinate);
    var lon = formatCoord(coordinates[0]);
    var lat = formatCoord(coordinates[1]);
    mousePositionElement.innerText = 'Coordinates: Longitude - ' + lon + ', Latitude - ' + lat;
  });
  

  var searchInput = document.getElementById('search-input');
  var searchButton = document.getElementById('search-button');
  

  function searchLocation(searchText) {
    var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + searchText;
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.length > 0) {
          var lon = parseFloat(data[0].lon);
          var lat = parseFloat(data[0].lat);
          map.getView().setCenter(ol.proj.fromLonLat([lon, lat]));
          map.getView().setZoom(5);
        } else {
          alert('Location not found!');
        }
      })
      .catch(function(error) {
        console.error('Error fetching location:', error);
        alert('Error searching location!');
      });
  }
  
  searchButton.addEventListener('click', function() {
    var searchTerm = searchInput.value;
    if (searchTerm) {
      searchLocation(searchTerm);
    }
  });

var contentDiv = document.getElementById('content');
var loginBtn = document.getElementById('login-btn');
var dashboardBtn = document.getElementById('dashboard-btn');
var farmManagerBtn = document.getElementById('farm-manager-btn');
var graphBtn = document.getElementById('graph-btn');
var farmListBtn = document.getElementById('farm-list-btn');
var logoutBtn = document.getElementById('logout-btn');