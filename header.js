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
//img tag
var home = document.createElement('img');
home.setAttribute('src', 'images/home.png');
home.setAttribute('alt', 'home');
home.style.height = 25 + 'px';
home.style.width = 25 + 'px';
home.style.marginTop = "auto";
home.style.marginBottom = "auto";
// a tag
var button = document.createElement('a');
button.style.marginTop = "auto";
button.style.marginBottom = "auto";
button.setAttribute('href', 'landingPage.html');
//<a> <img> </a>
button.appendChild(home);

// a tag - for spacing
var blankBut = document.createElement('a');
blankBut.style.height = 25 + 'px';
blankBut.style.width = 25 + 'px';


//container for header and styles
var header = document.createElement('div');
header.style.width = window.outerWidth;
header.style.height = 35 + 'px';
header.style.background = 'blue';
header.style.display = 'flex';
header.style.borderRadius = 0.25 + 'em';

//assemble and place header
header.appendChild(button);
header.appendChild(title);
header.appendChild(blankBut);
var placement = document.getElementById('header');
placement.appendChild(header);