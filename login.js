//firebase connection stuff

document.getElementById('btnLogIn').onclick = logInPressed;

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
            window.location = "success.html";
        }
        else
        {//user NOT signed in
            console.log("NOT signed in");
        }
    }
}

    
