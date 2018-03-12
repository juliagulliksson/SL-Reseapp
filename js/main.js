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

//Fix styling for search boxes

form.addEventListener('submit', function(event){
    event.preventDefault(); 
});

originSearchButton.addEventListener('click', function(){
    const inputValue = originInput.value;
    fetchDestinations(inputValue, originDiv, originSearchOutput, originOutputList);
});

destinationSearchButton.addEventListener('click', function(){
    const inputValue = destinationInput.value;
    fetchDestinations(inputValue, destinationDiv, destinationSearchOutput, destinationOutputList);
});

departureSearchButton.addEventListener('click', function(){
    const destinationID = document.getElementById('destinationID').value;
    const originID = document.getElementById('originID').value;
    fetchDepartures(originID, destinationID);
});

function fetchDepartures(originID, destinationID){
    fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/TravelplannerV3/trip.json?key=' + departureKey + '&originId=' + originID + '&destId=' + destinationID + '&searchForArrival=0&lang=sv')
      .then((response) => response.json())
      .then((departureData) => {
          displayDepartures(departureData);
      })
      .catch((error) => {
          console.log(error);
      });
}

function fetchDestinations(inputValue, div, searchOutput, list){
    fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/typeahead.json?key=' + placeKey + '&MaxResults=5&searchstring=' + inputValue)
      .then((response) => response.json())
      .then((destinationData) => {
          displayStationOptions(destinationData, div, searchOutput, list);
      })
      .catch((error) => {
          console.log(error);
      });
}


function displayStationOptions(destinationData, div, searchOutput, list){

    if(searchOutput.classList.contains('hidden')){
        searchOutput.classList.remove('hidden');
    }
    
    list.innerHTML = "";
    
    for(i in destinationData.ResponseData){
        const listOption = document.createElement('li');
        const hiddenInput = document.createElement('input');
        hiddenInput.type = "hidden";
        //Add the value of the destination's SiteID to the hidden input field
        hiddenInput.value = destinationData.ResponseData[i].SiteId;
        //The textContent of the listOption will be the name of the destination
        listOption.textContent = destinationData.ResponseData[i].Name;
        listOption.appendChild(hiddenInput);

        //Binds different functions depending on if it's the origin div or not
        if(div == originDiv){
            listOption.addEventListener('click', selectOrigin);
        }else{
            listOption.addEventListener('click', selectDestination);
        }
        
        list.appendChild(listOption);

    }
}

function selectOrigin(){
    inputValue = this.querySelector('input').value;

    //The new value of originInput will be the textContent of the list item
    originInput.value = this.textContent;

    createInputField("originID", originDiv);

    originSearchOutput.classList.add('hidden');

    showSearchButton();
}

function selectDestination(){
    inputValue = this.querySelector('input').value;

    //The new value of destinationInput will be the textContent of the list item
    destinationInput.value = this.textContent;

    createInputField("destinationID", destinationDiv);

    destinationSearchOutput.classList.add('hidden');

    showSearchButton();
}

function createInputField(id, div){

    if(div.querySelector("input[type=hidden]")){
        //If the hidden input field already exists, remove it
        div.removeChild(div.querySelector("input[type=hidden]"));
   }
    
    const hiddenInput = document.createElement('input');
    hiddenInput.type = "hidden";
    hiddenInput.value = inputValue;
    hiddenInput.id = id;

    //Add the hidden input field after the text input field
    div.insertBefore(hiddenInput, div.children[2]);

}

function showSearchButton(){
    //If both the hidden input fields are present in the two divs, show the departures search button
    if(originDiv.querySelector("input[type=hidden]") 
    && destinationDiv.querySelector("input[type=hidden]")){
        departureSearchButton.classList.remove('hidden');
    }
}

function displayDepartures(departureData){
    console.log(departureData);

    outputDiv.innerHTML = "";

    let departureInfo = ``;

    //Loop for displaying the departures
    for(i in departureData.Trip){
        departureInfo += `<div class="departure-wrapper">
        <span class="plus-sign">&#43;</span>`;
        let departureTrip = departureData.Trip[i].LegList.Leg;

        //The departure time and arrival time, origin name and destination name
        departureInfo += 
        `<p class="departure-time">${departureTrip[0].Origin.time} &#10142;
        ${departureTrip.slice(-1)[0].Destination.time}</p>

        <p>${departureData.Trip[0].LegList.Leg[0].Origin.name} &#10142;
        ${departureTrip.slice(-1)[0].Destination.name}</p>`;

        departureInfo += `<div class="trip-wrapper hidden">`;
        
        for (j in departureData.Trip[i].LegList.Leg) {
            departureInfo += `<div class="individual-trips">`;

            const departure = departureData.Trip[i].LegList.Leg[j];

            if (departure.type == "WALK") {
                departureInfo += `<p>  Gå till ${departure.Destination.name}</p>`;
            } else {
                departureInfo += `<p>${departure.Origin.name}</p>`;
                departureInfo += `<p>${departure.Product.name}</p>`;
                departureInfo += `<p> ${departure.Destination.name}</p>`;
                
            }

            if (departure.type != "WALK") {
                departureInfo += `
                    <p>  Avgång: ${departure.Origin.time} </p>
                    <p>  Ankomst: ${departure.Destination.time} </p>
                `;
            }
            departureInfo += `</div>`;
        }
        departureInfo += `</div>`;
        departureInfo += `</div>`;
    }

    outputDiv.innerHTML += departureInfo;

    //Run the function to add event listener to all of the departure-wrapper-divs
    addUnfoldListener();
   
}

function addUnfoldListener(){
    const clickDivs = outputDiv.querySelectorAll('div.departure-wrapper');

    console.log(clickDivs[0]);

    for(i = 0; i < clickDivs.length; i++){
    
        clickDivs[i].addEventListener('click', function(){
            console.log("hej");
            this.querySelector('span.plus-sign').classList.toggle('active');
            //Unfold or hide the trip-wrapper-div
            this.lastChild.classList.toggle('hidden');
          
        });
        
    }
}