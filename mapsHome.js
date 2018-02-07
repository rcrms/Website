
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
        radius: 15,
        opactiy: 1,
        maxIntensity: 3
    });
    heatmap.setMap(heatmapMap);
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

var activeLocations = [];//info of each marker for display in a table below map area
var activeLocationsIDs = [];//keys of each complaint to prevent duplicates
var allMarkers = {};
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
        var whereToDelete = '/' + complaintID;
        firebase.database().ref(whereToDelete).remove()
        .then(function() {
            console.log("Removed " + complaintID);
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message);
        });

        //reset heatmap
        heatmap.getData().clear();
        //remove marker from map
        allMarkers[complaintID].setMap(null);
        //remove ref to marker from obj
        delete allMarkers[complaintID];
        for(mark in allMarkers){//re-add all existing markers back into it
            var currLat = allMarkers[mark].position.lat();
            var currLng = allMarkers[mark].position.lng();
            var point = new google.maps.LatLng(parseFloat(currLat), parseFloat(currLng));
            heatmap.getData().push(point);//add point to heatmap
        }
        console.log("allMarkers{} ", allMarkers);
        console.log("heatmap.getData() ", heatmap.getData());
    } else {
        console.log("you did not want to delete " + complaintID);
    }
}

//firebase stuff
//region

function updateMap(){
    var formData = getFormData();
    console.log(formData);

    if(formData.county && formData.dataType && formData.fromDate && formData.toDate){
        //call getMapData cloud function
        //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
        var cloudFuncURL = "https://us-central1-firsttest-e58df.cloudfunctions.net/getMapData";
        var params = "?county=" + formData.county + 
                        "&dataType=" + formData.dataType +
                        "&fromDate=" + formData.fromDate +
                        "&toDate=" + formData.toDate +
                        "&key=" + cloudFuncKey;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("server response", xhttp.responseText);
                console.log("server response", JSON.parse(xhttp.responseText) );
                var serverResponse = JSON.parse(xhttp.responseText);//object to iterate through
                //all the code in the DB listener should be put here
                //to create all markers once the server responds with the data

                console.log("serverResponse before loop:\n", serverResponse);

                //clear previous data
                heatmap.getData().clear();
                markerClusterer.clearMarkers();
                //for each record returned from http request, add location to both maps
                for(var comp in serverResponse){
                    if (serverResponse.hasOwnProperty(comp)){

                        //create markers!
                        // console.log("new complaint:\n");
                        // console.log("lat: ", serverResponse[comp].lat);
                        // console.log("lng: ", serverResponse[comp].lng);
                        // console.log("addr: ", serverResponse[comp].wholeAddress);
                        var addrComponents = serverResponse[comp].wholeAddress.split('|');
                            /*
                            addrComponents[0] -> FB_streetNum
                            addrComponents[1] -> FB_streetName
                            addrComponents[2] -> FB_town
                            addrComponents[3] -> FB_state
                            addrComponents[4] -> FB_zipcode
                            //*/
                        var lat = serverResponse[comp].lat;
                        var lng = serverResponse[comp].lng;
                        

                        var point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
                        heatmap.getData().push(point);//add point to heatmap

                        var marker = new google.maps.Marker({'position': point});
                        //if any info was listed as 'undefined', set it to nothing
                        marker.complaintKey  = comp;
                        marker.FB_streetNum  = 
                            (addrComponents[0] == "undefined") ? "" : addrComponents[0]
                        marker.FB_streetName = 
                            (addrComponents[1] == "undefined") ? "" : addrComponents[1]
                        marker.FB_town       = 
                            (addrComponents[2] == "undefined") ? "" : addrComponents[2]
                        marker.FB_state      = 
                            (addrComponents[3] == "undefined") ? "" : addrComponents[3]
                        marker.FB_zipcode    = 
                            (addrComponents[4] == "undefined") ? "" : addrComponents[4]

                        marker.addListener('click', function() {
                            if(lastInfoWindow){ //close the previously open infowindow
                                lastInfoWindow.close();
                            }
                            var myPos = { //hold clicked marker location
                                lat: Number(parseFloat(this.getPosition().lat() ).toFixed(6) ), 
                                lng: Number(parseFloat(this.getPosition().lng() ).toFixed(6) )
                            };
                            //center map on marker
                            markerMap.panTo(myPos);
                            //var myMarker = this;
                            // var complaintKey = this.complaintKey;
                            var buttonHTML = '<input type="button" value="Delete"' +
                                ' onclick="handleMarkerDelete(\'' + this.complaintKey + '\')">';
                            var infowindowButton = htmlToElement(buttonHTML);
                            //the rest of the content of infowindow
                            var content = "My lat: " + myPos.lat + "<br>" + 
                                        "My lng: " + myPos.lng + "<br>" +
                                        "Key: " + this.complaintKey + "<br><br>" + 
                                        this.FB_streetNum + " " + this.FB_streetName + ", " +
                                        this.FB_town + " <br>" + this.FB_state + " " + 
                                        this.FB_zipcode + "<br><br>" +
                                        infowindowButton.outerHTML;  
                            
                            //actual infowindow obj
                            var infowindow = new google.maps.InfoWindow({
                                content: content
                            });
                            infowindow.open(markerMap, this);
                            //save newly created infowindow to be closed upon another marker's click
                            lastInfoWindow = infowindow;
                        });//end of marker click event handler
                        //add newly created marker to obj of all markers
                        //allows handleMarkerDelete() to remove marker from map view
                        allMarkers[comp] = marker;
                        markerClusterer.addMarker(marker);
                    }
                }//end of for loop over serverResonse
                /*for(mark in allMarkers){//re-add all existing markers back into it
                    var currLat = allMarkers[mark].position.lat();
                    var currLng = allMarkers[mark].position.lng();
                    var point = new google.maps.LatLng(parseFloat(currLat), parseFloat(currLng));
                    heatmap.getData().push(point);//add point to heatmap
                }//*/
            }
        };//end of xhttp.onreadystatechange
        xhttp.onerror = function(XMLHttpRequest, textStatus, errorThrown) {
            console.log( 'The data failed to load :(' );
            console.log(JSON.stringify(XMLHttpRequest));
            console.log("textStatus", textStatus);
            console.log("errorThrown", errorThrown);
            };
        var request = cloudFuncURL + params;
        xhttp.open("GET", request, true);
        xhttp.send();
        console.log("http req url\n", request);
    }//end of data validation if statement
}

//endregion

//bottom stuff
//region

function toggleMaps(){
//handles switching which of the two maps maintained is visible
//upon switching maps, their center and zoom properties are synced
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

    var button = document.getElementById('toggleHeatmapButton');
    
    if(button.disabled){
        button.disabled = false;
    } else {
        button.disabled = true;
    }
    toggleMaps(); 
}

function getFormData(){

    var datePicker1 = document.getElementById('fromDate');
    var datePicker2 = document.getElementById('toDate');
    var dataTypeLabel = document.getElementById('dataTypeLabel');
    var countyLabel = document.getElementById('countyLabel');

    //reset all error indications
    datePicker1.classList.remove('missingInfo');
    datePicker2.classList.remove('missingInfo');
    dataTypeLabel.classList.remove('missingInfo');
    countyLabel.classList.remove('missingInfo');

    var dataType;
    //get data type from radio buttons
    if(document.getElementById('dataTypeResolved').checked){
        dataType = "resolved";
    } else if(document.getElementById('dataTypeUnresolved').checked){
        dataType = "unresolved";
    } else if(document.getElementById('dataTypeAll').checked){
        dataType = "all";
    }

    //get form data
    var dropDown = document.getElementById('countySelect');
    var county = dropDown.options[dropDown.selectedIndex].text;
    var fromDate = datePicker1.value;//get date string
    var toDate = datePicker2.value;//get date string

    //check for errors for current submit
    if(!dataType){//data type group of radio buttons
        dataTypeLabel.classList.add('missingInfo');
    }
    if(!county){//county drop down menu
        countyLabel.classList.add('missingInfo');
    }
        //dates must be between the years 2000 and 2199 inclusive
        //must match YYYY-MM-DD or YYYY/MM/DD
    var dateRegex = /^2[0|1]\d{2}[\/\-](0[1-9]|1[012])[\/\-](0[1-9]|[12][0-9]|3[01])$/

    if(!dateRegex.test(fromDate)){
        datePicker1.classList.add('missingInfo');
        fromDate = null;
    } else {
        fromDate = fromDate.split('-');//make array
        var tempDate = fromDate[0];//hold year
        fromDate.shift();//remove year from fromDate[0]
        fromDate.push(tempDate);//put year at end
        fromDate = fromDate.join('/');//bring back to string
    }
    if(!dateRegex.test(toDate)){
        datePicker2.classList.add('missingInfo');
        toDate = null;
    } else {
        toDate = toDate.split('-');//make array
        var tempDate = toDate[0];//hold year
        toDate.shift();//remove year from fromDate[0]
        toDate.push(tempDate);//put year at end
        toDate = toDate.join('/');//bring back to string
    }
    //dates are now in format of 'MM/DD/YYYY' to match format on firebase

    return {
        dataType: dataType,
        county: county,
        fromDate: fromDate,
        toDate: toDate
    }
}
//endregion

//endregion