
//map stuff
//region
function centerMap(){
    //center map on user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        });
    }
}

var map, heatmap;

function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: {lat: 46.493990, lng: -84.362969}, //middle of CAS
    mapTypeId: 'hybrid' //options: roadmap, satellite, hybrid, terrain
});

heatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map
});
}

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

// Heatmap data
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

            var point = new google.maps.LatLng(lat, lng);
            heatmap.getData().push(point);
        }
    },

    function gotError(e){
        console.log("Error", e);
    });

//endregion
