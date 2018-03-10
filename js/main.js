//Reseplanerare 3
const departureKey = "9dcc27c7806146308e9a817303722483";
//Platsuppslag
const placeKey = "c3b5d6f2b9a1421185d7fa4e7e951daf"; 
const outputDiv = document.getElementById('departuresOutput');
const originInput = document.getElementById('originInput');
const originSearchButton = document.getElementById('originSearch');
const form = document.getElementById('searchForm');
const originSearchOutput = document.getElementById('originSearchOutput');
const destinationSearchOutput = document.getElementById('destinationSearchOutput');
const departureSearchButton = document.getElementById('searchSubmit');
const originDiv = document.getElementById('originInputs');
const destinationDiv = document.getElementById('destinationInputs');
const destinationSearchButton = document.getElementById('destinationSearch');
const destinationInput = document.getElementById('destinationInput');
const originOutputList = document.getElementById('originSearchOutputList');
const destinationOutputList = document.getElementById('destinationSearchOutputList');

//Error handling for the input field
//Be able to click on the departure box to get more info
//Bind a the display departures to the departure submit button
//Date and time for departure
//Styling!!

form.addEventListener('submit', function(event){
    event.preventDefault(); 
});

originSearchButton.addEventListener('click', function(){
    const inputValue = originInput.value;
    fetchDestinations(inputValue, true);
})

destinationSearchButton.addEventListener('click', function(){
    const inputValue = destinationInput.value;
    fetchDestinations(inputValue, false);
})

departureSearchButton.addEventListener('click', function(){
    const destinationID = document.getElementById('destinationID').value;
    const originID = document.getElementById('originID').value;
    fetchDepartures(originID, destinationID);
})

function fetchDepartures(originID, destinationID){
    fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/TravelplannerV3/trip.json?key=' + departureKey + '&originId=' + originID + '&destId=' + destinationID + '&searchForArrival=0&lang=sv')
      .then((response) => response.json())
      .then((departureData) => {
          displayDepartures(departureData);
          console.log(departureData)
      })
      .catch((error) => {
          console.log(error);
      });
}

function fetchDestinations(inputValue, origin){
    fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/typeahead.json?key=' + placeKey + '&MaxResults=5&searchstring=' + inputValue)
      .then((response) => response.json())
      .then((destinationData) => {
          console.log(destinationData);
          if (origin) {
            displayOriginOptions(destinationData)
          } else {
            displayDestinationOptions(destinationData)
          }
      })
      .catch((error) => {
          console.log(error);
      });
}

function displayOriginOptions(destinationData){
    //destinationDiv eller originDiv, originSearchOutput eller destinationSearchOutput, origin output list eller destinationlist
    //4 argument

    if(originSearchOutput.classList.contains('hidden')){
        originSearchOutput.classList.remove('hidden');
    }
    
    originOutputList.innerHTML = "";
    
    for(i in destinationData.ResponseData){
        const listOption = document.createElement('li');
        const hiddenInput = document.createElement('input');
        hiddenInput.type = "hidden";
        //Add the value of sideID to the hidden input field
        hiddenInput.value = destinationData.ResponseData[i].SiteId;
        //The textContent of the listOption will be the name of the destination
        listOption.textContent = destinationData.ResponseData[i].Name;
        listOption.appendChild(hiddenInput);

        //Bind the listOptions to the selectOrigin function
        listOption.addEventListener('click', selectOrigin);
        originOutputList.appendChild(listOption);
        //console.log(listOption);

    }
}

function displayDestinationOptions(destinationData){
    
    if(destinationSearchOutput.classList.contains('hidden')){
        destinationSearchOutput.classList.remove('hidden');
    }
    
    destinationOutputList.innerHTML = "";
    
    for(i in destinationData.ResponseData){
        const listOption = document.createElement('li');
        const hiddenInput = document.createElement('input');
        hiddenInput.type = "hidden";
        //Add the value of sideID to the hidden input field
        hiddenInput.value = destinationData.ResponseData[i].SiteId;
        //The textContent of the listOption will be the name of the destination
        listOption.textContent = destinationData.ResponseData[i].Name;
        listOption.appendChild(hiddenInput);

        //Bind the listOptions to the selectOrigin function
        listOption.addEventListener('click', selectDestination);
        destinationOutputList.appendChild(listOption);
       
    }
}

function selectOrigin(){

    console.log(this);

    inputValue = this.querySelector('input').value;
    console.log(inputValue);
    
    console.log(this.textContent);

    //The new value of originInput will be the textContent of the destination list item
    originInput.value = this.textContent;

    const hiddenInput = document.createElement('input');
    hiddenInput.type = "hidden";
    hiddenInput.value = inputValue;
    hiddenInput.id = "originID";
    if(originDiv.querySelector("input[type=hidden]")){
         //If the hidden input field already exists, remove it
        originDiv.removeChild(originDiv.querySelector("input[type=hidden]"));
    }
    //Add the hidden input field after the text input field
    originDiv.insertBefore(hiddenInput, originDiv.children[2]);

    originSearchOutput.classList.add('hidden');

    showSearchButton();
}


//Will take two arguments of the div and the list to be outputted
function selectDestination(){
    //origin search output and origin div 
    //2 arguments
    console.log(this);

    inputValue = this.querySelector('input').value;
    console.log(inputValue);
    
    console.log(this.textContent);

    //The new value of originInput will be the textContent of the destination list item
    destinationInput.value = this.textContent;

    const hiddenInput = document.createElement('input');
    hiddenInput.type = "hidden";
    hiddenInput.value = inputValue;
    hiddenInput.id = "destinationID";
    if(destinationDiv.querySelector("input[type=hidden]")){
         //If the hidden input field already exists, remove it
         destinationDiv.removeChild(destinationDiv.querySelector("input[type=hidden]"));
    }
    //Add the hidden input field after the text input field
    destinationDiv.insertBefore(hiddenInput, destinationDiv.children[2]);

    destinationSearchOutput.classList.add('hidden');

    showSearchButton();
}

function showSearchButton(){
    //If both the hidden input fields are present in the two divs, show the departures search button
    if(originDiv.querySelector("input[type=hidden]") 
    && destinationDiv.querySelector("input[type=hidden]")){
        departureSearchButton.classList.remove('hidden');
    }
}

function displayDepartures(departureData){
    //console.log(departureData);
    /*let destinations = `
      <p>  Från: ${departureData.Trip[0].LegList.Leg[0].Origin.name} </p>
      <p>  Till: ${departureData.Trip[0].LegList.Leg.slice(-1)[0].Destination.name} </p>
    `;
    outputDiv.innerHTML += destinations;*/

    let departureInfo = ``;
    departureInfo += `${departureData.Trip[0].LegList.Leg[0].Origin.name} &#10142;
    ${departureData.Trip[0].LegList.Leg.slice(-1)[0].Destination.name}`
    //Loop for displaying the departures
    for(i in departureData.Trip){
        departureInfo += `<div class="trip-wrapper">`;
        
        for(j in departureData.Trip[i].LegList.Leg){

            const departure = departureData.Trip[i].LegList.Leg[j];

            departureInfo += `<div class="destination-wrapper">`;

       

            if (departure.direction != undefined) {
                departureInfo += `<p>  Ta ${departure.Product.name} 
                &#10142; ${departure.direction}</p>`;
            } else if (departure.type == "WALK") {
                departureInfo += `<p>  Gå till ${departure.Destination.name}</p>`;
            } else {
                departureInfo += `<p> Ta ${departure.Product.name} 
                &#10142; ${departure.Destination.name}</p>`;
            }

           /* if (departure.direction != undefined) {
                departureInfo += `<p>  Ta ${departure.Product.name} 
                &#10142; ${departure.direction}</p>`;
            } else if (departure.type == "WALK") {
                departureInfo += `<p>  Gå till ${departure.Destination.name}</p>`;
            } else {
                departureInfo += `<p> Ta ${departure.Product.name} 
                &#10142; ${departure.Destination.name}</p>`;
            }*/

            if (departure.type != "WALK") {
                departureInfo += `
                    <p>  Avgång: ${departure.Origin.time} </p>
                    <p>  Ankomst: ${departure.Destination.time} </p>
                `;
            }

           departureInfo += `</div>`;
           
        }
        
        departureInfo += `</div>`;
    }

    outputDiv.innerHTML += departureInfo;
   
}

