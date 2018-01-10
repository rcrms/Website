var formData = [];
var myUser;

// Client ID and API key from the Developer Console
var CLIENT_ID = '';

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
function callMyAPI(){
    document.getElementById("groupByLabel").classList.remove("missingInfo");
    document.getElementById("fromDateLabel").classList.remove("missingInfo");
    document.getElementById("toDateLabel").classList.remove("missingInfo");
    document.getElementById("complaintTypeLabel").classList.remove("missingInfo");

    var radioBtnPressed, datesGiven, complaintGiven;

    var radios = document.getElementsByName('groupBy');
    for (var i = 0, length = radios.length; i < length; i++)
    {
        if (radios[i].checked)
        {
            //found the checked radio button
            formData["groupBy"] = radios[i].id;
            radioBtnPressed = true;
            break;
        }
    }

    pothole     = document.getElementById("pothole");
    snow        = document.getElementById("snow");
    obstruction = document.getElementById("obstruction");
    fromDate    = document.getElementById("fromDate");
    toDate      = document.getElementById("toDate");

    if(pothole.checked || snow.checked || obstruction.checked){
            complaintGiven = true;
    }
    if(fromDate.value != "" && toDate.value != ""){
        datesGiven = true;
    }

    if(radioBtnPressed && datesGiven && complaintGiven){
        //all data given, create report
        formData["pothole"] = pothole.checked;
        formData["snow"] = snow.checked;
        formData["obstruction"] = obstruction.checked;

        formData["fromDate"] = fromDate.value;
        formData["toDate"] = toDate.value;

        //CALL API HERE
        callScriptFunction();

    } else{//missing some info, narrow it down
        if(!radioBtnPressed){
            document.getElementById("groupByLabel").classList.add("missingInfo");
        }
        if(!datesGiven && fromDate.value == ""){
            document.getElementById("fromDateLabel").classList.add("missingInfo");
        }
        if(!datesGiven && toDate.value == ""){
            document.getElementById("toDateLabel").classList.add("missingInfo");
        }
        if(!complaintGiven){
            document.getElementById("complaintTypeLabel").classList.add("missingInfo");
        }

    }

    console.log(formData);
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
function callScriptFunction() {
    var scriptId = "";                    
                    
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
                'dude wheres my file',
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
