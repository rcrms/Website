/*
things to note for the marker listing table

-when creating checkboxes to insert into table:
    +be sure to add a click listener to uncheck the big daddy checkbox if any checkbox is unchecked at any point
    +give each checkbox the ID of the complaint they represent from the DB, so the code later may be able to query the DB with the checkbox's ID
-be sure to trigger a new DB query by clicking the submit button in code whenever there is an interation with the data in the table to sync map with new interation
-on clear all event, remove al tags from the table except the headings, then wait 500-800 ms before setting the div display to none

-+-+- if, when a marker is deleted using it's infowindow button, it's ID is contained within the activeLocationsIDs array, remove it from the array as well as the table. This way we dont get accidental updates to items that dont exit.
//*/


function insertMarkerIntoTable(marker){
//accepts a google marker object
//pull relavent data from the marker, insert that data into the table
//remove hidden class
    console.log('activeLocationsIDs before addition:', activeLocationsIDs);
    if(!activeLocationsIDs.includes(marker.FB_key)){
        var table = document.getElementById('markerTable');
        var trString = "<tr>" +
            "<td><input type=\"checkbox\" id=\"" + marker.FB_key + "\"></td> " +
            "<td>" + parseFloat(marker.getPosition().lat() ).toFixed(6) + "</td> " +
            "<td>" + parseFloat(marker.getPosition().lng() ).toFixed(6) + "</td> " +
            "<td>" + marker.FB_streetNum + " " + marker.FB_streetName + "</td> " +
            "<td>" + marker.FB_town + "</td> " +
            "<td>" + marker.FB_county + "</td> " +
            "<td>" + marker.FB_zipcode + "</td> " + "</tr>";
        var newTr = htmlToElement(trString);
        table.appendChild(newTr);
        activeLocationsIDs.push(marker.FB_key);    
    }
    console.log('activeLocationsIDs after addition:', activeLocationsIDs);
    document.getElementById('tableDiv').classList.remove('hidden');
}

document.getElementById('batchDelete').addEventListener('click', e => {
//delete all checked records from Firebase
    
    var IDs = getCheckboxIDs();
    if(confirm("Are you sure you wish to delete all checked records?")){
        for(id in IDs){
            var markerObj = allMarkers[IDs[id]];//marker obj -> get relavent props and do set query
    
            var key = markerObj.FB_key;
            firebase.database().ref("/" + key).remove();
            removeTableRow(IDs[id]);
        }
    }else{
        window.alert("You spared them!");
    }
});

document.getElementById('batchResolve').addEventListener('click', e => {
//alter all records in Firebase to contain "resolved" as a status
    
    var IDs = getCheckboxIDs();

    for(id in IDs){
        var markerObj = allMarkers[IDs[id]];//marker obj -> get relavent props and do set query

        var key                 = markerObj.FB_key;
        var newStatus           = "resolved";

        var newStatusDate       = markerObj.FB_status_date.split("_");
        newStatusDate[0] = "resolved";
        newStatusDate = newStatusDate.join("_");

        var newStatusCountyDate = markerObj.FB_status_county_date.split("_");
        newStatusCountyDate[0]  = "resolved";
        newStatusCountyDate = newStatusCountyDate.join("_");

        console.log("new info for " + key);
        console.log("\tnewStatus:", newStatus);
        console.log("\tnewStatusDate:", newStatusDate);
        console.log("\tnewStatusCountyDate:", newStatusCountyDate);

        firebase.database().ref("/" + key).update({
            status : newStatus,
            status_date : newStatusDate,
            status_county_date : newStatusCountyDate
        });
        removeTableRow(IDs[id]);
    }
});

document.getElementById('batchUnresolve').addEventListener('click', e => {
//alter all records in Firebase to contain "unresolved" as a status

    var IDs = getCheckboxIDs();

    for(id in IDs){
        var markerObj = allMarkers[IDs[id]];//marker obj -> get relavent props and do set query

        var key                 = markerObj.FB_key;
        var newStatus           = "unresolved";

        var newStatusDate       = markerObj.FB_status_date.split("_");
        newStatusDate[0] = "unresolved";
        newStatusDate = newStatusDate.join("_");

        var newStatusCountyDate = markerObj.FB_status_county_date.split("_");
        newStatusCountyDate[0]  = "unresolved";
        newStatusCountyDate = newStatusCountyDate.join("_");

        console.log("new info for " + key);
        console.log("\tnewStatus:", newStatus);
        console.log("\tnewStatusDate:", newStatusDate);
        console.log("\tnewStatusCountyDate:", newStatusCountyDate);

        firebase.database().ref("/" + key).update({
            status : newStatus,
            status_date : newStatusDate,
            status_county_date : newStatusCountyDate
        });
        removeTableRow(IDs[id]);
    }
    
});

document.getElementById('logButton').addEventListener('click', e => {
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
    //console.log("before loop", checkboxes);
    var allIDs = [];
    for (box in checkboxes){
        if(checkboxes[box].id && checkboxes[box].id != "checkAll" && checkboxes[box].checked){
            //if the child is a checkbox, not checkAll, and is checked -> hold it
            console.log(checkboxes[box].id.toString());
            allIDs.push(checkboxes[box].id.toString());
        }

    // console.log("allIDs #",box, ": ", allIDs[box]);
    }
    //allIDs now contains all keys for all checked complaints
    console.log("allIDs: ", allIDs);
    // return allIDs;
    for(id in allIDs){
        var key = allIDs[id];
        var obj = allMarkers[key];
        console.log("allMarkers[", id, "]: ");
        console.log("\tFB_status:", obj.FB_status);
        console.log("\tFB_status_date:", obj.FB_status_date);
        console.log("\tFB_status_county_date:", obj.FB_status_county_date);

    }

});

document.getElementById('checkAll').addEventListener('click', e => {
//handle checking all checkboxes in table
    if(document.getElementById('checkAll').checked){
        console.log("check all of them");
        var inputs = document.querySelectorAll("input[type='checkbox']");
        for(var i = 0; i < inputs.length; i++) {
            inputs[i].checked = true;   
        }
    }else{
        console.log("UNcheck all of them");
        var inputs = document.querySelectorAll("input[type='checkbox']");
        for(var i = 0; i < inputs.length; i++) {
            inputs[i].checked = false;   
        }
    }
});
document.getElementById('batchClear').addEventListener('click', e => {
//remove all complaints from table
    // var table = document.getElementById('markerTable');
    // while(table.childNodes[1]){
    //     table.removeChild(table.childNodes[1]);
    // }

    var elmtTable = document.getElementById('markerTable');
    var tableRows = elmtTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;
    
    for (var x = rowCount - 1; x > 0; x--) {
       elmtTable.removeChild(tableRows[x]);
    }

    activeLocationsIDs = [];
    window.setTimeout(() => {
        document.getElementById('tableDiv').classList.add('hidden');
        document.getElementById('checkAll').checked = false;
    }, 1300);
    
});

function centerMap(){
//center map on user location as determined by the browser
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
    return {lat: 46.493571, lng: -84.362886};
}

//global map vars so they can be accessed elsewhere
var heatmapMap, heatmap, markerMap, markers, markerClusterer, lastInfoWindow;

function initMap() {
//sets up both google maps, markerClusterer, then heatmap
    markerMap = new google.maps.Map(document.getElementById('map2'),{
        zoom: 17,
        center: getLocation(), 
            //{lat: 46.493990, lng: -84.362969} //middle of CAS
        mapTypeId: 'roadmap', //options: roadmap, satellite, hybrid, terrain
        gestureHandling: 'cooperative'
    });
    
    var markers = [];
    var opt = {
        averageCenter: true,
        gridSize: 45
    };
    markerClusterer = new MarkerClusterer(markerMap, [], opt);

    //////////////////////////////////////////////

    heatmapMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: getLocation(),
        // center: {lat: 46.493990, lng: -84.362969}, //middle of CAS
        mapTypeId: 'hybrid', //options: roadmap, satellite, hybrid, terrain
        gestureHandling: 'cooperative'
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        radius: 15,
        opactiy: 1,
        maxIntensity: 3
    });
    heatmap.setMap(heatmapMap);
}

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

//hold all firebase IDs of markers sent to the table, prevents adding a marker to the table twice
var activeLocationsIDs = [];
//maintains which points are being shown, when altered via map/table, it will update both maps
var allMarkers = {};

function htmlToElement(html) {
//create the button in the infowindow which passes its ID to its onClick function
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
function handleMarkerDelete(complaintID){
//removes complaint from DB represented by a marker on the map, 
//then updates the heatmap version with remaining markers
//this func is only called from a marker's infowindow
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

function updateMap(){
//makes http request for data from firebase matching the form parameters
//then adds all data in server response to both google maps
    var formData = getFormData();
    console.log(formData);

    if(formData.county && formData.dataType && formData.fromDate && formData.toDate){
        //call getMapData cloud function
        var cloudFuncURL = "https://us-central1-firsttest-e58df.cloudfunctions.net/getMapData";
        var params = "?county=" + formData.county + 
                        "&dataType=" + formData.dataType +
                        "&fromDate=" + formData.fromDate +
                        "&toDate=" + formData.toDate +
                        "&key=" + cloudFuncKey;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // console.log("server response", xhttp.responseText);
                // console.log("server response", JSON.parse(xhttp.responseText) );
                var serverResponse = JSON.parse(xhttp.responseText);//object to iterate through

                //clear previous data
                heatmap.getData().clear();
                markerClusterer.clearMarkers();
                //for each record returned from http request, add location to both maps
                for(var comp in serverResponse){
                    if (serverResponse.hasOwnProperty(comp)){
                        var addrComponents     = serverResponse[comp].wholeAddress.split('|');
                        var lat                = serverResponse[comp].lat;
                        var lng                = serverResponse[comp].lng;
                        var county             = serverResponse[comp].county;
                        var status             = serverResponse[comp].status;
                        var status_county_date = serverResponse[comp].status_county_date;
                        var status_date        = serverResponse[comp].status_date;

                        
                        var point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
                        heatmap.getData().push(point);//add point to heatmap

                        var marker = new google.maps.Marker({'position': point});
                        //if any info was listed as 'undefined', set it to nothing
                        marker.FB_key  = comp;

                        //hold these three for updating purposes
                        marker.FB_status = status;
                        marker.FB_status_county_date = status_county_date;
                        marker.FB_status_date = status_date;

                        //hold the rest for display in the table
                        marker.FB_county = 
                            (county == "undefined") ? "" : county
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
                            // var FB_key = this.FB_key;
                            var buttonHTML = '<input type="button" value="Delete"' +
                                ' onclick="handleMarkerDelete(\'' + this.FB_key + '\')">';
                            var infowindowButton = htmlToElement(buttonHTML);
                            //the rest of the content of infowindow
                            var content = "My lat: " + myPos.lat + "<br>" + 
                                        "My lng: " + myPos.lng + "<br>" +
                                        "Key: " + this.FB_key + "<br><br>" + 
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

                            insertMarkerIntoTable(this);
                        });//end of marker click event handler
                        //add newly created marker to obj of all markers
                        //allows handleMarkerDelete() to remove marker from map view
                        allMarkers[comp] = marker;
                        markerClusterer.addMarker(marker);
                    }
                }//end of for loop over serverResonse
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

function getCheckboxIDs(){
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
    //console.log("before loop", checkboxes);
    var allIDs = [];
    for (box in checkboxes){
        if(checkboxes[box].id && checkboxes[box].id != "checkAll" && checkboxes[box].checked){
            //if the child is a checkbox, not checkAll, and is checked -> hold it
            console.log(checkboxes[box].id.toString());
            allIDs.push(checkboxes[box].id.toString());
        }

    // console.log("allIDs #",box, ": ", allIDs[box]);
    }
    //allIDs now contains all keys for all checked complaints
    // console.log("allIDs: ", allIDs);
    return allIDs;
}

function removeTableRow(elID){
    var removingTR = document.getElementById('elID').parentNode.parentNode;
    removingTR.parentNode.removeChild(removingTR);
}