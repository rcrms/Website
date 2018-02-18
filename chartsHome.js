var colors = [
    'rgba(160, 0, 171, 0.5)',
    'rgba(255, 0, 0, 0.5)',
    'rgba(0, 255, 0, 0.5)',
    'rgba(0, 0, 255, 0.5)',
    'rgba(0, 179, 0, 0.5)',
    'rgba(255, 125, 0, 0.5)',
    'rgba(255, 77, 210, 0.5)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(0, 255, 255, 0.5)',
    'rgba(0, 255, 0, 0.5)',
    'rgba(0, 179, 0, 0.5)',
    'rgba(255, 77, 210, 0.5)'
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
    'rgba(0, 255, 255, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 179, 0, 1)',
    'rgba(255, 77, 210, 1)'
]
function getColors(){
    var c = colors.slice(0, data.labels.length);
    console.log("colors:", c);
    return c;
}
function getOutlines(){
    var c = outlines.slice(0, data.labels.length);
    console.log("outlines:", c);
    return c;
}
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
var regOptions = {
    layout:{
        padding:{
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        }
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};
var radarOptions = {
    layout:{
        padding:{
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        }
    }
};
var pieOptions = {
    layout:{
        padding:{
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        }
    }
};
var data = {};


/*
var data = {
    //labels: [],
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
        label: "Unresolved complaints from Chippewa County\n01/01/2018 - 01/30/2018",
        backgroundColor: colors[0],
        borderColor: outlines[0],
        //data: []
        data: [6, 26, 31, 4, 67, 41, 66]
    }
    ////////
    // ,
    // {
    //     label: "My Second dataset",
    //     backgroundColor: colors[1],
    //     borderColor: outlines[1],
    //     data: []
    //     // data: [45, 12, 30, 55, 9, 61, 26]
    // }
    ////////
    ]
}
*/
//give default chart type
var chart = new Chart(ctx, {type: type, data: data, options: regOptions});

function makePieChart(){
    type = 'pie';
    if(Object.keys(data).length == 0){ return; }
    chart.destroy();
    data.datasets[0].backgroundColor = getColors();
    data.datasets[0].borderColor = getOutlines();
    console.log("making " + type + " chart:", data);
    chart = new Chart(ctx, {type: type, data: data, options: pieOptions});
}
function makeLineChart(){
    type = 'line';
    if(Object.keys(data).length == 0){ return; }
    chart.destroy();
    data.datasets[0].backgroundColor = colors[0];
    data.datasets[0].borderColor = outlines[0];
    console.log("making " + type + " chart:", data);
    chart = new Chart(ctx, {type: type, data: data, options: regOptions});
}
function makeBarChart(){
    type = 'bar';
    if(Object.keys(data).length == 0){ return; }
    chart.destroy();
    data.datasets[0].backgroundColor = getColors();
    data.datasets[0].borderColor = getOutlines();
    console.log("making " + type + " chart:", data);
    chart = new Chart(ctx, {type: type, data: data, options: regOptions});
}
function makeRadarChart(){
    type = 'radar';
    if(Object.keys(data).length == 0){ return; }
    chart.destroy();
    data.datasets[0].backgroundColor = colors[0];
    data.datasets[0].borderColor = outlines[0];
    console.log("making " + type + " chart:", data);
    chart = new Chart(ctx, {type: type, data: data, options: radarOptions});
}
function makePolarAreaChart(){
    type = 'polarArea';
    if(Object.keys(data).length == 0){ return; }
    chart.destroy();
    data.datasets[0].backgroundColor = getColors();
    data.datasets[0].borderColor = getOutlines();
    console.log("making " + type + " chart:", data);
    chart = new Chart(ctx, {type: type, data: data, options: pieOptions});
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
                    var serverResponse = JSON.parse(xhttp.responseText);//object to iterate through

                    console.log("server response 1 ", serverResponse );
                    data = serverResponse;
                    
                    data.datasets[0].data.length = data.labels.length;
                    for(i in data.labels)
                    {
                        if (data.datasets[0].data[i] == undefined)
                        {
                            data.datasets[0].data[i] = 0;
                        }
                    }
  
                    chart.destroy();
                    switch(type){
                        case "radar":
                            data.datasets[0].backgroundColor = colors[0];
                            data.datasets[0].borderColor = outlines[0];
                            chart = new Chart(ctx, {type: type, data: data, options: radarOptions});
                            break;
                        case "line":
                            data.datasets[0].backgroundColor = colors[0];
                            data.datasets[0].borderColor = outlines[0];
                            chart = new Chart(ctx, {type: type, data: data, options: regOptions});
                            break;
                        case "bar":
                            data.datasets[0].backgroundColor = getColors();
                            data.datasets[0].borderColor = getOutlines();
                            chart = new Chart(ctx, {type: type, data: data, options: regOptions});
                            break;
                        case "pie":
                            data.datasets[0].backgroundColor = getColors();
                            data.datasets[0].borderColor = getOutlines();
                            chart = new Chart(ctx, {type: type, data: data, options: pieOptions});
                            break;
                        case "polarArea":
                            data.datasets[0].backgroundColor = getColors();
                            data.datasets[0].borderColor = getOutlines();
                            chart = new Chart(ctx, {type: type, data: data, options: pieOptions});
                            break;
                        default:
                            console.log("default of switch(type)");
                    }
                    
                    // chart.update();

                    console.log("new data:\n",data);

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