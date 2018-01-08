//get and parse url
var url = window.location.href;
//console.log(url);
var arr = url.split("/");
var page = (arr[arr.length - 1]).split(".")[0];
//console.log(page);
var title = document.createElement('h3');
switch(page)
{//using url, decide text of title
    case "landingPage":
        title.innerText = "Home";
        break;
    case "chartsHome":
        title.innerText = "Charts";
        break;
    case "mapsHome":
        title.innerText = "Maps";
        break;
    case "reportsHome":
        title.innerText = "Reports";
        break;
    default:
        console.log("Error: Reached unknown page");
}
//title styles
title.style.color = "white";
title.style.margin = "auto";
//home button
var home = document.createElement('img');
home.setAttribute('src', 'images/home.png');
home.setAttribute('alt', 'home');
home.style.height = 25 + 'px';
home.style.width = 25 + 'px';
home.style.marginTop = "auto";
home.style.marginBottom = "auto";
// a tag
var button1 = document.createElement('a');
button1.style.marginTop = "auto";
button1.style.marginBottom = "auto";
button1.setAttribute('href', 'landingPage.html');
//<a> <img> </a>
button1.appendChild(home);

//////////////////////////

var signMeOut = function(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("signout successfull");
        // window.location = "login.html";
    }).catch(function(error) {
        // An error happened.
        console.log('error on logout', error);
    });
}

//////////////////////////

//logout button1 
var logout = document.createElement('img');
logout.setAttribute('src', 'images/logoutIcon.png');
logout.setAttribute('alt', 'home');
logout.style.height = 25 + 'px';
logout.style.width = 25 + 'px';
logout.style.marginTop = "auto";
logout.style.marginBottom = "auto";
// a tag
var button2 = document.createElement('a');
button2.style.marginTop = "auto";
button2.style.marginBottom = "auto";
button2.addEventListener('click', signMeOut , false);
//<a> <img> </a>
button2.appendChild(logout);


//container for header and styles
var header = document.createElement('div');
header.style.width = window.outerWidth;
header.style.height = 35 + 'px';
header.style.background = '#0040FF';
header.style.display = 'flex';
header.style.borderRadius = 0.25 + 'em';

//assemble and place header
header.appendChild(button1);
header.appendChild(title);
header.appendChild(button2);
var placement = document.getElementById('header');
placement.appendChild(header);