
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
//firebase connection stuff

function logInPressed(){
    
    var email = document.getElementById('txtEmail').value;
    var pass = document.getElementById('txtPass').value;
    //authentication obj
    const auth = firebase.auth();
    //authentication attempt
    auth.signInWithEmailAndPassword(email, pass).then(authChanged).catch(authError);
    
    function authError(error)
    {
        //console.log(error.message);
        window.location = "failure.html";
    }
    function authChanged(user){
        if(user)
        {//user signed in
            //console.log("signed in!", user);
            window.location = "landingPage.html";
        }
        else
        {//user NOT signed in
            console.log("NOT signed in");
        }
    }
}

    
