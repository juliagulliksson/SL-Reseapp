const departureKey = "9dcc27c7806146308e9a817303722483";
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
const errorDiv = document.getElementById('error');

form.addEventListener('submit', function(event){
    event.preventDefault(); 
});

originSearchButton.addEventListener('click', function(){
    displayLoader(originSearchOutput);
    const inputValue = originInput.value;
    fetchDestinations(inputValue, originSearchOutput, originOutputList);
});

destinationSearchButton.addEventListener('click', function(){
    displayLoader(destinationSearchOutput);
    const inputValue = destinationInput.value;
    fetchDestinations(inputValue, destinationSearchOutput, destinationOutputList);
});

departureSearchButton.addEventListener('click', function(){
    displayLoader(outputDiv);
    const destinationID = destinationDiv.querySelector("input[type=hidden]").value;
    const originID = originDiv.querySelector("input[type=hidden]").value;
    fetchDepartures(originID, destinationID);
});

function fetchDepartures(originID, destinationID){

    fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/TravelplannerV3/trip.json?key=' + departureKey + '&originId=' + originID + '&destId=' + destinationID + '&searchForArrival=0&lang=sv')
      .then((response) => response.json())
      .then((departureData) => {
          displayDepartures(departureData);
      })
      .catch((error) => {
          displayErrors(error);
      });
}

function fetchDestinations(inputValue, searchOutput, list){
    const validate = validateForm(inputValue);
    if (validate) {
       fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/typeahead.json?key=' + placeKey + '&MaxResults=5&searchstring=' + inputValue)
      .then((response) => response.json())
      .then((destinationData) => {
          removeLoader(list);
          displayStationOptions(destinationData, searchOutput, list);
      })
      .catch((error) => {
          displayErrors(error);
      });
    } else {
        inputValue = "";
    }
}

function displayLoader(div){
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loader');
    div.appendChild(loadingDiv);
}

function removeLoader(list){
    const div = list.parentElement;
    const loadingDiv = div.querySelector('div.loader');
    div.removeChild(loadingDiv);
}

function validateForm(inputValue){
    if (!inputValue.replace(/^\s+/g, '').length) { //Input field is empty
          return false;
      } else { // Form is correct 
          return true;
    }
}

function displayErrors(error){
    const errorMessage = error.ErrorDetails.errorText;
    const errorCapitalized = capitalizeFirstLetter(errorMessage);
    errorDiv.innerHTML = `<p class="error">Error: ${errorCapitalized}</p>`;
}

function displayStationOptions(destinationData, searchOutput, list){

    if(searchOutput.classList.contains('hidden')){
        searchOutput.classList.remove('hidden');
    }
    list.innerHTML = "";
    errorDiv.innerHTML = "";
    
    for(let i in destinationData.ResponseData){
        const listOption = document.createElement('li');
        const hiddenInput = document.createElement('input');
        hiddenInput.type = "hidden";

        //Add the value of the destination's SiteID to the hidden input field
        hiddenInput.value = destinationData.ResponseData[i].SiteId;

        //The textContent of the listOption will be the name of the choosen destination
        listOption.textContent = destinationData.ResponseData[i].Name;
        listOption.appendChild(hiddenInput);

        //Binds different functions depending on if it's the origin list or not
        if(list == originOutputList){
            listOption.addEventListener('click', selectOrigin);
        }else{
            listOption.addEventListener('click', selectDestination);
        }
        
        list.appendChild(listOption);
    }
}

function selectOrigin(){

    if(originDiv.querySelector("input[type=hidden]")){
        //If the hidden input field already exists, remove it
        originDiv.removeChild(originDiv.querySelector("input[type=hidden]"));
   }
    const hiddenInput = this.querySelector('input');

    //Add the hidden input field after the text input field
    originDiv.insertBefore(hiddenInput, originDiv.children[2]);

    //The new value of originInput will be the textContent of the list item
    originInput.value = this.textContent;

    originSearchOutput.classList.add('hidden');

    showSearchButton();

    originOutputList.innerHTML = "";
}

function selectDestination(){
    if(destinationDiv.querySelector("input[type=hidden]")){
        //If the hidden input field already exists, remove it
        destinationDiv.removeChild(destinationDiv.querySelector("input[type=hidden]"));
   }
    const hiddenInput = this.querySelector('input');

    //Add the hidden input field after the text input field
    destinationDiv.insertBefore(hiddenInput, destinationDiv.children[2]);

    //The new value of destinationInput will be the textContent of the list item
    destinationInput.value = this.textContent;

    destinationSearchOutput.classList.add('hidden');

    showSearchButton();

    destinationOutputList.innerHTML = "";
}

function showSearchButton(){
    //If both the hidden input fields are present in the two divs, show the departures search button
    if(originDiv.querySelector("input[type=hidden]") 
    && destinationDiv.querySelector("input[type=hidden]")){
        departureSearchButton.classList.remove('hidden');
    }
}

function displayDepartures(departureData){

    if(departureData.Message == "Proxy error"){
        displayErrors(departureData);
    }
    outputDiv.innerHTML = "";

    let departureInfo = ``;

    //Loop to display the departures
    for(let i in departureData.Trip){
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
        
        for (let j in departureData.Trip[i].LegList.Leg) {
            const departure = departureData.Trip[i].LegList.Leg[j];
            
            if (departure.type != "WALK") {
                departureInfo += `<div class="individual-trips">`;

                const productName = departure.Product.name;
                const productCapitalized = capitalizeFirstLetter(productName);
    
                departureInfo += `<p class="destination-info">${departure.Origin.time} 
                ${departure.Origin.name}</p>`;
                departureInfo += `<span class="italic">${productCapitalized}</span>`;
                departureInfo += `<p class="destination-info">${departure.Destination.time} 
                ${departure.Destination.name}</p>`;

                departureInfo += `</div>`;
            }
        }
        departureInfo += `</div>`;
        departureInfo += `</div>`;
    }
    outputDiv.innerHTML += departureInfo;

    //Run function to add event listener to all of the departure-wrapper-divs
    addUnfoldListener();
}

function addUnfoldListener(){
    const clickDivs = outputDiv.querySelectorAll('div.departure-wrapper');

    for(i = 0; i < clickDivs.length; i++){
    
        clickDivs[i].addEventListener('click', function(){
            //Toggle the class "active" to change the color of the plus sign
            this.querySelector('span.plus-sign').classList.toggle('active');
            //Show or hide the trip-wrapper-div
            this.lastChild.classList.toggle('hidden');
          
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}