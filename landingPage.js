const numberInTicker = 5;

function createTableHeading(){
    var tr = document.createElement('tr');
    var head1 = document.createElement('th');
    var head2 = document.createElement('th');
    var head3 = document.createElement('th');

    head1.innerText = "Date";
    head2.innerText = "Time";
    head3.innerText = "Address";

    tr.appendChild(head1);
    tr.appendChild(head2);
    tr.appendChild(head3);

    return tr;
}
function displayTicker(arr){
    // console.log("displayTicker array:", arr);
    const tickerTable = document.getElementById('ticker');
    while(tickerTable.firstChild){//clear out all children from previous calls
        tickerTable.removeChild(tickerTable.firstChild);
    }
    var heading = createTableHeading();
    tickerTable.appendChild(heading);

    for(complaint in arr){
        var tr = document.createElement('tr');
        var address = arr[complaint].wholeAddress;
        if(address.split("|")[0] != "undefined"){
            var formattedAddress = 
                address.split("|")[0] + " " + 
                address.split("|")[1] + ", " + 
                address.split("|")[2] + ", " +
                address.split("|")[3] + " " +
                address.split("|")[4];
        }else{
            var formattedAddress = "\t " + 
            address.split("|")[1] + ", " + 
            address.split("|")[2] + ", " +
            address.split("|")[3] + " " +
            address.split("|")[4];

        }
        var date = arr[complaint].date;
        var time = arr[complaint].time;
        
        var dateTD = document.createElement('td');
        var timeTD = document.createElement('td');
        var addressTD = document.createElement('td');

        dateTD.innerText = date;
        timeTD.innerText = time;
        addressTD.innerText = formattedAddress;
        tr.appendChild(dateTD);
        tr.appendChild(timeTD);
        tr.appendChild(addressTD);

        ticker.appendChild(tr);
    }
}



const database = firebase.database().ref('/');

database.orderByChild('date_time').startAt('0').on("value", 
data => {
    var allObj = data.val();//gets JSON obj of all data at the level provided by ref()
    var keys = Object.keys(allObj);//gets all keys for the same level
    var objArr = [];
    for(i = 0; i < keys.length; i++)
    {
        var key = keys[i];//gets current key - submissionID
        objArr.push(allObj[key]);
        var lat = allObj[key].lat;//gets current obj name
        var lng = allObj[key].lng;//gets current obj name
        var date_time = allObj[key].date_time;
    }

    //objArr is now an array with all my objects and can use array sorting
    objArr.sort((a,b) => {
        var aDate = a.date_time.split("_")[0];
        var aTime = a.date_time.split("_")[1];
        var bDate = b.date_time.split("_")[0];
        var bTime = b.date_time.split("_")[1];

        a = new Date(aDate + " " + aTime);
        b = new Date(bDate + " " + bTime);

        return a > b ? -1 : a < b ? 1 : 0;
    });
    //show only as many as we want
    objArr = objArr.slice(0,numberInTicker);
    
    displayTicker(objArr);

}, err => {
    console.log("error callback: ", err);
})

function batchDelete(){

    document.getElementById("delete").addEventListener("click", function(event){
        event.preventDefault();
    })
    database.orderByChild('status').equalTo('resolved').on("value", 
    data => {
    var allObj = data.val();//gets JSON obj of all data at the level provided by ref()
    var keys = Object.keys(allObj);//gets all keys for the same level
    var objArr = [];

      for(i = 0; i < keys.length; i++)
        {           
            key = keys[i];//gets current key - submissionID
            var status = allObj[key].status;
            console.log(status);
            if(status == "resolved")
            {
                var statusRef = database.child(key);                
                statusRef.remove();

               //database.remove();
            }
            else{
                debugger;
            }       
        }
        txt = "Successfully removed all resolved complaints. "
        console.log('returning.');
        return;
  
    });

    return;
}


