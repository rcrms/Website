
//map stuff
//region
function centerMap(){
    //center map on user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            map2.setCenter(initialLocation);
        });
    }
}

var map, map2, heatmap, heatmap2;

function initMap() {
    map2 = new google.maps.Map(document.getElementById('map2'), {
        zoom: 10,
        center: {lat: 46.493990, lng: -84.362969}, //middle of CAS
        mapTypeId: 'roadmap' //options: roadmap, satellite, hybrid, terrain
    });

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: 46.493990, lng: -84.362969}, //middle of CAS
        mapTypeId: 'hybrid' //options: roadmap, satellite, hybrid, terrain
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: map
    });
    heatmap2 = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: map2
    });
}
//region
function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// // Heatmap data
function getPoints() {
    return [

        new google.maps.LatLng(46.272431, -84.450658),
        new google.maps.LatLng(46.272131, -84.450648),
        new google.maps.LatLng(46.272651, -84.450458),
        new google.maps.LatLng(46.271451, -84.450618),
        new google.maps.LatLng(46.272751, -84.450651),
        new google.maps.LatLng(46.272441, -84.450698),
        new google.maps.LatLng(46.272851, -84.450858),
        new google.maps.LatLng(46.272251, -84.451658),
        new google.maps.LatLng(46.272481, -84.450258),
        new google.maps.LatLng(46.272051, -84.450758)
    ];
}
//endregion

//endregion


//firebase stuff
//region

  // Initialize Firebase
  
var DBref = firebase.database().ref('mapsPageTest');

var div = document.getElementById('form');

DBref.on('value', 
  //this func takes 3 arguements
    //event
    //event handler
    //error handler
    function gotData(data)
    {
        heatmap.getData().clear();
        heatmap2.getData().clear();
        while (div.firstChild) 
        {//removes all current children
            div.removeChild(div.firstChild);
        }
        var allObj = data.val();//gets JSON obj of all data at the level provided by ref()
        var keys = Object.keys(allObj);//gets all keys for the same level
        
        for(i = 0; i < keys.length; i++)
        {
            var key = keys[i];//gets current key - submissionID
            var lat = allObj[key].lat;//gets current obj name
            var lng = allObj[key].lng;//gets current obj name

            //console.log(lat, lng);
            var p = document.createElement('p');
            p.innerText = 'lat: ' + lat + ' lng: ' + lng;
            div.appendChild(p);

            var point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
            heatmap.getData().push(point);
            heatmap2.getData().push(point);
        }
        console.log('heatmap1 data', heatmap.getData());
        console.log('heatmap2 data', heatmap2.getData());
    },

    function gotError(e){
        console.log("Error", e);
    });

//endregion



function toggleMaps(){
    var firstMap = document.getElementById('map');
    var secondMap = document.getElementById('map2');

    if(firstMap.classList.contains('hidden')){
        //firstMap is currently hidden, update its info with info from secondMap before switching them
        map.setZoom(map2.getZoom() );
        map.setCenter(map2.getCenter() );
    }else{
        //secondMap is currently hidden, update its info with info from firstMap before switching them
        map2.setZoom(map.getZoom() );
        map2.setCenter(map.getCenter() );
    }
    //switch which map is visible
    document.getElementById('map').classList.toggle('hidden');
    document.getElementById('map2').classList.toggle('hidden');
    //hold current map centers
    var m1center = map.getCenter();
    var m2center = map2.getCenter();
    //redraw maps
    google.maps.event.trigger(map, 'resize');
    google.maps.event.trigger(map2, 'resize');
    //reset centers
    map.setCenter(m1center);
    map2.setCenter(m2center);
}
function getMapInfo(){
    console.clear();
    console.log("map1", map.getCenter().toString(), map.getZoom());
    console.log("map2", map2.getCenter().toString(), map2.getZoom());
    var eq = (map.getCenter() == map2.getCenter());
    console.log(eq);
}