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
var type = 'line', options = {};
var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
        label: "My First dataset",
        backgroundColor: colors[0],
        borderColor: outlines[0],
        data: [6, 26, 31, 4, 67, 41, 66]
    },
    {
        label: "My Second dataset",
        backgroundColor: colors[1],
        borderColor: outlines[1],
        data: [45, 12, 30, 55, 9, 61, 26]
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
function makeDoughnutChart(){
    chart.destroy();
    type = 'doughnut';
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