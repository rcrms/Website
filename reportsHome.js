var myUser;

// Client ID and API key from the Developer Console
var CLIENT_ID = '795179805624-e6n5vspsihs6fitkg11rhal3s7ttgh2c.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://script.googleapis.com/$discovery/rest?version=v1"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES =  'https://www.googleapis.com/auth/documents ' +
            'https://www.googleapis.com/auth/drive ' +
            'https://www.googleapis.com/auth/script.external_request ' +
            'https://www.googleapis.com/auth/userinfo.email';

function onSignIn(googleUser){
    myUser = googleUser;
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); 
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); 
    document.getElementById('submitBtn').classList.remove('hidden');
}

function submitForm(){
    var csv = document.getElementById('csvCheckbox').checked;
    if(csv){
        //user DOES want a csv
        createCSV();
    } else {
        //user does NOT want a csv
        if(!gapi.auth2.getAuthInstance().isSignedIn.get()){
            //user is NOT signed in -> sign them in then call API
            gapi.auth2.getAuthInstance().signIn().then(callMyAPI, 
                function handleError(e){
                    console.log('Google sign in error!', e);
                });
        } else{
            //user is signed in
            callMyAPI();
        }
    }
}
/* SIGN OUT

<a href="#" onclick="signOut();">Sign out</a>
<script>
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
</script>

*/
function createCSV(){
    var formData = getFormData();
    console.log(formData);
    if(formData.county && formData.dataType && formData.fromDate && formData.groupBy && formData.toDate){//ready to query firebase
        //call getCSVData cloud function
            //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
        //parse http request response
            //https://www.kirupa.com/html5/making_http_requests_js.htm
        //download file for user
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
function callMyAPI(){
    var formData = getFormData();
    console.log(formData);
    if(formData.county && formData.dataType && formData.fromDate && formData.groupBy && formData.toDate){//ready to query firebase
        callScriptFunction(formData);
    }
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

/**
 *  Called when the signed in status changes.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
      //user is signed in
      console.log('updateSigninStatus() -> if (isSignedIn)');
    //   document.getElementById('submitBtn').classList.remove('hidden');
    
  } else {
      //user is NOT signed in
      console.log('updateSigninStatus() -> else');
    //   document.getElementById('submitBtn').classList.add('hidden');
      
  }
}

/**
 * Load the API and make an API call.
 */
function callScriptFunction(formData) {
    var scriptId = "1opnMbOWoORI4iGfhWl9UPJGDxdYzQp1NUqTJmPX43ZGZezK5LJdV6kNg";
                    
    // Call the Execution API run method
    //   'scriptId' is the URL parameter that states what script to run
    //   'resource' describes the run request body (with the function name
    //              to execute)

    //parameters can be anything, just play around with them to determine how to use them
    gapi.client.script.scripts.run({
        'scriptId': scriptId,
        'resource': {
            'function': 'alterTemplate',
            'parameters':[
                formData
            ]
        }
    }).then(function(resp) {
            var result = resp.result;
            if (result.error && result.error.status) {
            // The API encountered a problem before the script
            // started executing.
            console.log('Error calling API:');
            console.log(JSON.stringify(result, null, 2));

            console.log("if(result.error && result.error.status)");

        } else if (result.error) {
            // The API executed, but the script returned an error.
            console.log("else if (result.error)");
            // Extract the first (and only) set of error details.
            // The values of this object are the script's 'errorMessage' and
            // 'errorType', and an array of stack trace elements.
            var error = result.error.details[0];
            console.log('Script error message: ' + error.errorMessage);

            if (error.scriptStackTraceElements) {
                // There may not be a stacktrace if the script didn't start
                // executing.
                console.log("if (error.scriptStackTraceElements)");
                console.log('Script error stacktrace:');
                for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                    var trace = error.scriptStackTraceElements[i];
                    console.log('\t' + trace.function + ':' + trace.lineNumber);
                }
            }
        } else {
        //this is where to put reactionary code to your function
            //handling return values and such - currently none
            
            console.log("aaaaaaand we're back!", result.response.result);
        }
    });
}
