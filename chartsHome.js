//this whole page is all about manipulating the datasets array
var colors = [
    'rgba(160, 0, 171, 0.5)',
    'rgba(255, 0, 0, 0.5)',
    'rgba(0, 255, 0, 0.5)',
    'rgba(0, 0, 255, 0.5)',
    'rgba(0, 179, 0, 0.5)',
    'rgba(255, 125, 0, 0.5)',
    'rgba(255, 77, 210, 0.5)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(0, 255, 255, 0.5)'
]
var outlines = [
    'rgba(160, 0, 171, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 179, 0, 1)',
    'rgba(255, 125, 0, 1)',
    'rgba(255, 77, 210, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(0, 255, 255, 1)'
]
/*
colors
rgb(160, 0, 171) - dark purple
rbg(255, 0, 0) - bright red
rgb(0, 255, 0) - bright green
rbg(0, 0, 255) - bright blue
rgb(0, 179, 0) - dark green
rbg(255, 125, 0) - orange
rgb(255, 77, 210) - bright pink
rgb(255, 255, 0) - yellow
rgb(0, 255, 255) - aqua
*/
var ctx = document.getElementById('myChart').getContext('2d');
var type = 'line';
var options = {};
var data = {
    labels: [],
    // labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
        label: "My First dataset",
        backgroundColor: colors[0],
        borderColor: outlines[0],
        data: []
        // data: [6, 26, 31, 4, 67, 41, 66]
    },
    {
        label: "My Second dataset",
        backgroundColor: colors[1],
        borderColor: outlines[1],
        data: []
        // data: [45, 12, 30, 55, 9, 61, 26]
    }]
}
//give default chart type
var chart = new Chart(ctx, {type: type, data: data, options: options});

function makePieChart(){
    chart.destroy();
    type = 'pie';
    chart = new Chart(ctx, {type: type, data: data, options: options});
}
function makeLineChart(){
    chart.destroy();
    type = 'line';
    chart = new Chart(ctx, {type: type, data: data, options: options});
}
function makeBarChart(){
    chart.destroy();
    type = 'bar';
    chart = new Chart(ctx, {type: type, data: data, options: options});
}
function makeRadarChart(){
    chart.destroy();
    type = 'radar';
    chart = new Chart(ctx, {type: type, data: data, options: options});
}
function makePolarAreaChart(){
    chart.destroy();
    type = 'polarArea';
    chart = new Chart(ctx, {type: type, data: data, options: options});
}

function saveIt(){
    //create a hidden anchor tag with proper info and trigger the click
    var a = document.createElement('a');
    a.setAttribute('href', chart.toBase64Image());
    a.setAttribute('download', 'newChart.png');
    a.click();
}
function submitForm(){
    
    var formData = getFormData();

    console.log(formData);

    if(formData.county && formData.dataType && formData.fromDate && formData.groupBy && formData.toDate){//ready to query firebase
        //call getChartData cloud function
            //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
            var cloudFuncURL = "https://us-central1-firsttest-e58df.cloudfunctions.net/getChartData";
            var params = "?county=" + formData.county + 
                         "&dataType=" + formData.dataType +
                         "&fromDate=" + formData.fromDate +
                         "&toDate=" + formData.toDate +
                         "&groupBy=" + formData.groupBy +
                         "&key=" + cloudFuncKey;


            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("server response", xhttp.responseText);
                    console.log("server response", JSON.parse(xhttp.responseText) );
                    var serverResponse = JSON.parse(xhttp.responseText);//object to iterate through
                }else{
                    console.log("not good...");
                    console.log("this.readyState", this.readyState);
                    console.log("this.status", this.status);
                }
            };
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
        //parse http request response
            //https://www.kirupa.com/html5/making_http_requests_js.htm
    }
}
function getFormData(){

    var datePicker1 = document.getElementById('fromDate');
    var datePicker2 = document.getElementById('toDate');
    var dataTypeLabel = document.getElementById('dataTypeLabel');
    var groupByLabel = document.getElementById('groupByLabel');
    var countyLabel = document.getElementById('countyLabel');

    //reset all error indications
    datePicker1.classList.remove('missingInfo');
    datePicker2.classList.remove('missingInfo');
    dataTypeLabel.classList.remove('missingInfo');
    groupByLabel.classList.remove('missingInfo');
    countyLabel.classList.remove('missingInfo');

    var dataType, groupBy;
    //get data type from radio buttons
    if(document.getElementById('dataTypeResolved').checked){
        dataType = "resolved";
    } else if(document.getElementById('dataTypeUnresolved').checked){
        dataType = "unresolved";
    } else if(document.getElementById('dataTypeAll').checked){
        dataType = "all";
    }
    //get group by data from radio buttons
    if(document.getElementById('groupByDay').checked){
        groupBy = "day";
    } else if(document.getElementById('groupByWeek').checked){
        groupBy = "week";
    } else if(document.getElementById('groupByMonth').checked){
        groupBy = "month";
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
    if(!groupBy){//group by group of radio buttons
        groupByLabel.classList.add('missingInfo');
    }
    if(!county){//county drop down menu
        countyLabel.classList.add('missingInfo');
    }
        //dates must be between the years 2000 and 2199 inclusivee
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
        groupBy: groupBy,
        county: county,
        fromDate: fromDate,
        toDate: toDate
    }
}