//*
//Place the Firebase connection info here
 // */

  //get variable to access DB
    //you may specify a path inside the ref method below
    //doing so will start your DB connection at that path
    //accessing levels beyond the first is done with a '/'
  var DBref = firebase.database().ref('test');
  
  //get variable to access ul tag
  var list = document.getElementById('list');
  
  //essentially an event handler for the data in database
  //first arg - event to handle
  //second arg - successful handle - do something
  //thrid arg - error handler
  DBref.on('value', 
  //this func takes 3 arguements
    //event - value
    //event handler - gotData()
    //error handler - gotErr()
    function gotData(data)
    {
        var ul = document.getElementById('list');
        //ul.removeChild
        while (ul.firstChild) 
        {//removes all current children
            ul.removeChild(ul.firstChild);
        }
        //console.log(data.val());
        var allObj = data.val();//gets JSON obj of all data at the level provided by ref()
        var keys = Object.keys(allObj);//gets all keys for the same level
        var list = document.getElementById('list');//ref for html ul tag
        //console.log(keys);//troubleshooting
        for(i = 0; i < keys.length; i++)
        {
            var key = keys[i];//gets current key - submissionID
            var lat = allObj[key].Lat;//gets current obj name
            var long = allObj[key].Lng;//gets current obj name

            //console.log(name, data);

            var li = document.createElement('li');//makes new li tag
            li.className = "li";//assigns class name
            li.innerText = "Lat: " + lat + " - Lng: " + long;//assigns text
            list.appendChild(li);//adds new li to hardcoded ul in html
        }
    },
    function gotErr(err)
    {//error handler
        console.log("Error!");
        console.log(err);
    });//end of DBref.on()

    //ref to button in html - this example only pulls data, no writing
    /*
    document.getElementById('button').onclick = submitData;
    function submitData()
    {//button event handler
        console.log('button click function');
        //ref to textbox
        var input = document.getElementById('newData');
        //value of text within textbox
        var newData = input.value;
        if(newData != "")
        {//actual text inside text box
            var localDBref = firebase.database().ref('test');
            var push = {//making the data to push a JSON object insures the data
                        //will be nested below the generated ID, this way,
                        //we dont need to know the IDs, we can iterate over them
                Lat: "tyler", //dummy placeholder
                Lng: newData//text from textbox
            }
            localDBref.push(push);//send to DB
        }
        //console.log("newData:");
        //console.log(newData);
    }

    */