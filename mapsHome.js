
//map init stuff
//region
function centerMap(){
    //center map on user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            //data is found below, that's what initialLocation is set to
            //lat: 46.2724099
            //lng: -84.45063669999999
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            heatmapMap.setCenter(initialLocation);
            markerMap.setCenter(initialLocation);
        });
    }
}

function getLocation(){
    return {lat: 46.272131, lng: -84.450648};
}

//global map vars so they can be accessed elsewhere
var heatmapMap, heatmap, markerMap, markers, markerClusterer, lastInfoWindow;

function initMap() {

// clustered markers map variables

    markerMap = new google.maps.Map(document.getElementById('map2'),{
        zoom: 17,
        center: getLocation(), 
            //{lat: 46.493990, lng: -84.362969} //middle of CAS
        mapTypeId: 'roadmap' //options: roadmap, satellite, hybrid, terrain
    });
    
    var markers = [];
    // Add a marker clusterer to manage the markers.
    var opt = {
        averageCenter: true,
        gridSize: 45
    };
    markerClusterer = new MarkerClusterer(markerMap, [], opt);
    

    //USE ANOTHER VERSION OF THE MARKERCLUSTERER - MARKERCLUSTERERPLUS
    //https://htmlpreview.github.io/?https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/docs/examples.html
    //http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/docs/reference.html
 
// heatmap variables

    heatmapMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: getLocation(),
        // center: {lat: 46.493990, lng: -84.362969}, //middle of CAS
        mapTypeId: 'hybrid' //options: roadmap, satellite, hybrid, terrain
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: heatmapMap
    });
}
//region
function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : heatmapMap);
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

//use this to create the button in the infowindow which passes its ID to its onClick function
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
function handleMarkerDelete(complaintID){
    console.log("handleMarkerDelete()", complaintID);

    if(window.confirm("Are you sure you want to remove this complaint?")){
        var whereToDelete = 'mapsPageTest/' + complaintID;
        firebase.database().ref(whereToDelete).remove()
        .then(function() {
            console.log("Removed " + complaintID);
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message);
        });
    } else {
        console.log("you did not want to delete " + complaintID);
    }

}

//firebase stuff
//region

  // Initialize Firebase
  
var DBref = firebase.database().ref('mapsPageTest');

// var div = document.getElementById('form');

DBref.on('value', 
  //this func takes 3 arguements
    //event
    //event handler
    //error handler
    function gotData(data)
    {
        //clear any previous data held by the maps
        heatmap.getData().clear();
        markerClusterer.clearMarkers();
        
        var allObj = data.val();//gets JSON obj of all data at the level provided by ref()
        var keys = Object.keys(allObj);//gets all keys for the same level
        
        for(i = 0; i < keys.length; i++)
        {//set up marker for each complaint in database
            var key = keys[i];//gets current key - submissionID
            var lat = allObj[key].lat;//gets current obj lat
            var lng = allObj[key].lng;//gets current obj lng

            var point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
            heatmap.getData().push(point);

            var marker = new google.maps.Marker({'position': point, 'title': key});

            marker.addListener('click', function(arg) {

                if(lastInfoWindow){ //close the previously open infowindow
                    lastInfoWindow.close();
                }
                // console.log('markerListener arg', arg)
                var myPos = { //hold clicked marker location
                    lat: Number(parseFloat(this.getPosition().lat() ).toFixed(6) ), 
                    lng: Number(parseFloat(this.getPosition().lng() ).toFixed(6) )
                };

                var markerTitle = this.getTitle();
                //button inside infowindow
                var buttonHTML = '<input type="button" value="Delete"' +
                    ' onclick="handleMarkerDelete(\'' + markerTitle + '\')">';
                var infowindowButton = htmlToElement(buttonHTML);
                //the rest of the content of infowindow
                var content = "My lat: " + myPos.lat + "<br>" + 
                              "My lng: " + myPos.lng + "<br>" +
                              "Me: " + markerTitle + "<br><br>" + 
                              infowindowButton.outerHTML;   

                //center map on marker
                markerMap.panTo(myPos);
                // console.log('myPos', myPos);

                //start reverse geocoding
                var geocoder = new google.maps.Geocoder;
                var markerAddress = {};
                geocoder.geocode({'location': myPos}, function(results, status) {
                    if (status === 'OK') {
                      if (results[0]) {
                          //grabs markers reverse geocoded address
                        markerAddress.number = results[0].address_components[0].short_name;
                        markerAddress.street = results[0].address_components[1].short_name;
                        markerAddress.town   = results[0].address_components[2].short_name;

                        console.log('markerAddress', markerAddress);

                        content += " <br><br>" + markerAddress.number + "<br>" +
                                    markerAddress.street + "<br>" + markerAddress
                        
                      } else {
                        window.alert('No results found');
                      }
                    } else {
                      window.alert('Geocoder failed due to: ' + status);
                    }
                  });//end of geocoder.geocode()  
                  
                  
                //actual infowindow obj
                var infowindow = new google.maps.InfoWindow({
                    content: content
                });
                infowindow.open(markerMap, this);
                //save newly created infowindow to be closed upon another marker's click
                lastInfoWindow = infowindow;

                  console.log('markerAddress after geocoder', markerAddress);             
            });//end of marker click listener

            //add newly created marker to its map
            markerClusterer.addMarker(marker);
        }
        // console.log('heatmap data', heatmap.getData());
        // console.log('markerMap data', markerClusterer.getMarkers());
        // console.log('markerClusterer grid size:', markerClusterer.getGridSize());

        //end of gotData() for firebase database connection
    },
    function gotError(e){
        console.log("Error", e);
    });

//endregion

//bottom stuff
//region

function toggleMaps(){
//handles switching which of the two maps maintained is visible
//upon switching maps, their center and zoom properties are synced
//try playing with their Z-index properties to avoid the trigger(map, 'resize') syntax
    var firstMap = document.getElementById('map');
    var secondMap = document.getElementById('map2');//not used - could test the if below with both div class checks

    if(firstMap.classList.contains('hidden')){
        //firstMap is currently hidden, update its info with info from secondMap before switching them
        heatmapMap.setZoom(markerMap.getZoom() );
        heatmapMap.panTo(markerMap.getCenter() );
    }else{
        //secondMap is currently hidden, update its info with info from firstMap before switching them
        markerMap.setZoom(heatmapMap.getZoom() );
        markerMap.panTo(heatmapMap.getCenter() );
    }
    //switch which map is visible
    document.getElementById('map').classList.toggle('hidden');
    document.getElementById('map2').classList.toggle('hidden');
    //hold current map centers
    var m1center = heatmapMap.getCenter();
    var m2center = markerMap.getCenter();
    //redraw maps
    google.maps.event.trigger(heatmapMap, 'resize');
    google.maps.event.trigger(markerMap, 'resize');
    //reset centers
    heatmapMap.panTo(m1center);
    markerMap.panTo(m2center);
}

//panel stuff
//region

function slideToggle() {
    //get child div w/ class of slider
    var slider = document.getElementById("mapTypeSlider");
    //toggle slid class to change desired properties
    slider.classList.toggle("slid"); 
    toggleMaps(); 
}

function updateMap(){
//currently this func only logs results of the customize panel, but the end goal
//of this func is to alter the contents of the maps
    //array of all checkboxes in DOM
    var cbs = document.querySelectorAll("input[type='checkbox']");
    //values of all checkBoxes in DOM
    var checkBoxValues = {};

    for(var i = 0; i < cbs.length; i++){
        //true/false value of checkbox
        var currVal = cbs[i].checked;
        //unique ID of checkbox
        var currID = cbs[i].id;
        //store value associated with appropriate DOM ID
        checkBoxValues[currID] = currVal;
    }
    console.log(checkBoxValues);

    //get toggles values - if there only ends up being one, simplify this code
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