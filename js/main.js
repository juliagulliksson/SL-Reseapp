const div = document.getElementById('output');
const departureKey = "9dcc27c7806146308e9a817303722483";//Reseplanerare 3
const placeKey = "c3b5d6f2b9a1421185d7fa4e7e951daf";//Platsuppslag

function fetchDepartures(){
    fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/TravelplannerV3/trip.json?key=' + departureKey + '&originId=9626&destId=1002&searchForArrival=0&lang=sv')
        .then(function(response) {
        return response.json();
      })
      .then(function(departureData){
          //console.log(departureData);
          displayDepartures(departureData);
      })
      .catch(function(error){
          console.log(error);
      });
}

fetchDepartures();


function displayDepartures(departureData){
    console.log(departureData);
    let destinations = `
      <p>  Från: ${departureData.Trip[0].LegList.Leg[0].Origin.name} </p>
      <p>  Till: ${departureData.Trip[0].LegList.Leg.slice(-1)[0].Destination.name} </p>
    `;
    div.innerHTML += destinations;

    let departureInfo = ``;
    
    for(i in departureData.Trip){
        departureInfo += `<div class="trip-wrapper">`;
        console.log(departureData.Trip[i]);
        for(j in departureData.Trip[i].LegList.Leg){
            departureInfo += `
            <div class="destination-wrapper">
                <p>  Avgång: ${departureData.Trip[i].LegList.Leg[j].Origin.time} </p>
                <p>  Ankomst: ${departureData.Trip[i].LegList.Leg[j].Destination.time} </p>
            `;

            if (departureData.Trip[i].LegList.Leg[j].direction != undefined) {
                departureInfo += `<p>  Ta ${departureData.Trip[i].LegList.Leg[j].Product.name} 
                mot ${departureData.Trip[i].LegList.Leg[j].direction}</p>`;
            } else if (departureData.Trip[i].LegList.Leg[j].type == "WALK") {
                departureInfo += `<p>  Gå till ${departureData.Trip[i].LegList.Leg[j].Destination.name}</p>`;
            } else {
                departureInfo += `<p>  Mot: ${departureData.Trip[i].LegList.Leg[j].Destination.name}</p>`;
            }
           
           departureInfo += `</div>`;
           
        }
        
        departureInfo += `</div>`;
    }
    div.innerHTML = departureInfo;
   
}
//<p>  Ta: ${departureData.Trip[i].LegList.Leg[j].Product.name}</p>