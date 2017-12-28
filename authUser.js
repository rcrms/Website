
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