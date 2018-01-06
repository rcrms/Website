
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
    //currently creating 2 different maps as an example of alternating between them
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

//endregion

//endregion

//firebase stuff
//region

  // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCQTQUHVnUhGfSHjRfYLYvWU18fvbITFMs",
            authDomain: "firsttest-e58df.firebaseapp.com",
            databaseURL: "https://firsttest-e58df.firebaseio.com",
            projectId: "firsttest-e58df",
            storageBucket: "firsttest-e58df.appspot.com",
            messagingSenderId: "795179805624"
          };
          firebase.initializeApp(config);
  
var DBref = firebase.database().ref('mapsPageTest');

// var div = document.getElementById('form');

DBref.on('value', 
  //this func takes 3 arguements
    //event
    //event handler
    //error handler
    function gotData(data)
    {
        heatmap.getData().clear();
        heatmap2.getData().clear();
        // while (div.firstChild) 
        // {//removes all current children
        //     div.removeChild(div.firstChild);
        // }
        var allObj = data.val();//gets JSON obj of all data at the level provided by ref()
        var keys = Object.keys(allObj);//gets all keys for the same level
        
        for(i = 0; i < keys.length; i++)
        {
            var key = keys[i];//gets current key - submissionID
            var lat = allObj[key].lat;//gets current obj name
            var lng = allObj[key].lng;//gets current obj name

            //console.log(lat, lng);
            // var p = document.createElement('p');
            // p.innerText = 'lat: ' + lat + ' lng: ' + lng;
            // div.appendChild(p);

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

//bottom stuff
//region

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

//panel stuff
//region

//assign click listener to all toggles
var classname = document.getElementsByClassName("toggle");

var slideToggle = function() {
    //get child div w/ class of slider
    var slider = this.childNodes[1];
    //toggle slid class to change desired properties
    slider.classList.toggle("slid");  
};

for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', slideToggle, false);
}

function updateMap(){
    // console.log('submit was pressed');
    //array of all checkboxes in DOM
    var cbs = document.querySelectorAll("input[type='checkbox']");
    //values of all checkBoxes in DOM
    var checkBoxValues = {};
    // console.log(cbs);
    for(var i = 0; i < cbs.length; i++){
        //true/false value of checkbox
        var currVal = cbs[i].checked;
        //unique ID of checkbox
        var currID = cbs[i].id;
        // console.log(currVal, currID);
        //store value associated with appropriate DOM ID
        checkBoxValues[currID] = currVal;
    }
    //key        => value
    //checkBoxID => valueOfCheckBox
    console.log(checkBoxValues);

    //get toggles values
    //all toggles
    var toggles = document.getElementsByClassName("toggle");
    var toggleValues = {};

    for(var i = 0; i < toggles.length; i++){
        //get current toggle's slider child
        currSlider = toggles[i].childNodes[1];
        currToggleID = toggles[i].id;

        if(currSlider.classList.contains("slid")){
            //current toggle is ON
            toggleValues[currToggleID] = true;
        }else{
            //current toggle is OFF
            toggleValues[currToggleID] = false;            
        }
    }

    console.log(toggleValues);

    var fromDate = document.getElementById('fromDate');
    var toDate = document.getElementById('toDate');
    //dateObj.value returns a string in the format "YYYY-MM-DD"
    //to assign value of a data picker -? dateObj.value = "2014-08-12";
    console.log(fromDate.value, toDate.value);

}
//endregion

//endregion