
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

firebase.auth().onAuthStateChanged(
    function(user)
    {//ensures only authorized users may access this page
        if(!user)
        {//user == null -> not authorized user, redirect to login.html
            //console.log("user == null");
            window.location = "login.html"
        }
    }
);