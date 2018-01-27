
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
    firebase.auth().signInWithEmailAndPassword(email, pass).then(authChanged).catch(authError);
    
    function authError(error)
    {//attempted to sign in, failed
        // console.log(error.message);
        // window.location = "failure.html";
        if(e = document.getElementById('error')){
            e.parentNode.removeChild(e);
        }
        console.log("authError(error)", error.code);
        if(error.code == "auth/wrong-password"){
            var msg = document.createElement('p');
            msg.id = 'error';
            msg.innerHTML = 'Incorrect password.';
            msg.style.color = "red";
            document.body.appendChild(msg);
        }
        if(error.code == "auth/user-not-found" || error.code == "auth/invalid-email"){
            var msg = document.createElement('p');
            msg.id = 'error';
            msg.innerHTML = 'Incorrect email.';
            msg.style.color = "red";
            document.body.appendChild(msg);
        }
    }
    function authChanged(user){
        if(user)
        {//user signed in
            window.location = "landingPage.html";
        }
        else
        {//user NOT signed in
            console.log("NOT signed in");
        }
    }
}

    
