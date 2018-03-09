const outputDiv = document.getElementById('output');
const departureKey = "9dcc27c7806146308e9a817303722483";//Reseplanerare 3
const placeKey = "c3b5d6f2b9a1421185d7fa4e7e951daf";//Platsuppslag
const originInput = document.getElementById('origin');
const dataList = document.getElementById('destinationOrigin');
const submitButton = document.getElementById('submitSearch');
const form = document.getElementById('searchForm');

form.addEventListener('submit', function(event){
    event.preventDefault(); 
});

submitButton.addEventListener('click', function(){
    const inputValue = originInput.value;
    showDestinations(inputValue);
})

/*originInput.addEventListener('keyup', function(){
    const inputValue = originInput.value;
    showDestinations(inputValue);
});*/

function fetchDepartures(){
    fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/TravelplannerV3/trip.json?key=' + departureKey + '&originId=9625&destId=1002&searchForArrival=0&lang=sv')
      .then((response) => response.json())
      .then((departureData) => {
          displayDepartures(departureData);
      })
      .catch((error) => {
          console.log(error);
      });
}

function showDestinations(inputValue){
    fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/typeahead.json?key=' + placeKey + '&searchstring=' + inputValue)
      .then((response) => response.json())
      .then((destinationData) => {
          console.log(destinationData);
          displayDestinationOptions(destinationData);
      })
      .catch((error) => {
          console.log(error);
      });
}

/*function displayDestinationOptions(destinationData){
    let destinationOption = ``;
    console.log(destinationData.ResponseData);

    for(i in destinationData.ResponseData){
        destinationOption += `<option value="${destinationData.ResponseData[i].Name}" id="${destinationData.ResponseData[i].SiteId}"></option>`;
    }

    dataList.innerHTML += destinationOption;
    if (dataList.innerHTML == ""){
        alert("Hej");
    }
}*/

function displayDestinationOptions(destinationData){
    const outputDiv = document.getElementById('searchOutput');
    let destinationOption = `<ul>`;

    for(i in destinationData.ResponseData){
        destinationOption += `<li>${destinationData.ResponseData[i].Name}
        <input type="hidden" value="${destinationData.ResponseData[i].SiteId}"></li>`;
    }
    destinationOption += `</ul>`;
    outputDiv.innerHTML = destinationOption;





}

fetchDepartures();


function displayDepartures(departureData){
    console.log(departureData);
    let destinations = `
      <p>  Från: ${departureData.Trip[0].LegList.Leg[0].Origin.name} </p>
      <p>  Till: ${departureData.Trip[0].LegList.Leg.slice(-1)[0].Destination.name} </p>
    `;
    outputDiv.innerHTML += destinations;

    let departureInfo = ``;
    
    //Loop to display the departures
    for(i in departureData.Trip){
        departureInfo += `<div class="trip-wrapper">`;
        
        for(j in departureData.Trip[i].LegList.Leg){

            const departure = departureData.Trip[i].LegList.Leg[j];

            departureInfo += `<div class="destination-wrapper">`;

            if (departure.direction != undefined) {
                departureInfo += `<p>  Ta ${departure.Product.name} 
                                 mot ${departure.direction}</p>`;
            } else if (departure.type == "WALK") {
                departureInfo += `<p>  Gå till ${departure.Destination.name}</p>`;
            } else {
                departureInfo += `<p> Ta ${departure.Product.name} 
                                     mot: ${departure.Destination.name}</p>`;
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
    }

    outputDiv.innerHTML += departureInfo;
   
}

