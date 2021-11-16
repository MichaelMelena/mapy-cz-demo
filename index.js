function load() {
  Loader.async = true;
  Loader.load(null, null, createMap);
}

function createMap() {
  var center = SMap.Coords.fromWGS84(14.4179, 50.12655);
  var m = new SMap(JAK.gel("m"), center, 13);
  m.addDefaultLayer(SMap.DEF_BASE).enable();

  //adds controls
  m.addDefaultControls();

  // creates new marker layer
  var layer = new SMap.Layer.Marker();
  m.addLayer(layer);
  layer.enable();

  // creates new marker
  var options = {};
  var marker = new SMap.Marker(center, "myMarker", options); //cords, markerId, options
  layer.addMarker(marker);

  // clusterer
  var clusterer = new SMap.Marker.Clusterer(m);
  layer.setClusterer(clusterer);
  var markers = [];

  for (var i = 0; i < 1000; i++) {
    var x = 3 * Math.random() + 13;
    var y = Math.random() + 49.5;
    var coords = SMap.Coords.fromWGS84(x, y);
    var marker = new SMap.Marker(coords);
    markers.push(marker);
  }
  layer.addMarker(markers);


  //Load path from xml (xml is retrieved via HTTP request)
  var response = function(xmlDoc) {
    var souradnice = [];
    var coords = xmlDoc.getElementsByTagName("coord");
    var maxPoints = Math.min(200, coords.length);
    for (var i=0;i<maxPoints;i++) {
        var index = Math.round(coords.length * (i / maxPoints));
        var node = coords[index];
        var lat = parseFloat(node.getAttribute("lat"));
        var lon = parseFloat(node.getAttribute("lon"));
        var c = SMap.Coords.fromWGS84(lat, lon);
        souradnice.push(c);
    }
    
    var vrstva = new SMap.Layer.Geometry();     /* Geometrická vrstva */
    m.addLayer(vrstva);                          /* Přidat ji do mapy */
    vrstva.enable();                         /* A povolit */
    
    var options = {
        color: "blue",
        opacity: 0.3,
        outlineColor: "blue",
        outlineOpacity: 0.7,
        outlineWidth: 4,
        curvature: 0
    };
    var polygon = new SMap.Geometry(SMap.GEOMETRY_POLYGON, null, souradnice, options);    
    vrstva.addGeometry(polygon);
    
    var cz = m.computeCenterZoom(souradnice); /* Spočítat pozici mapy tak, aby byl vidět celý mnohoúhelník */
    m.setCenterZoom(cz[0], cz[1]);
    }
    
    var request = new JAK.Request(JAK.Request.XML);
    request.setCallback(window, response);
    request.send("/cr.xml");
}




window.addEventListener("load", () => load());
