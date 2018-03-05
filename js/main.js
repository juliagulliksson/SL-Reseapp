//Reseplanereare 3:
// 9dcc27c7806146308e9a817303722483

function fetchDepartures(){
    fetch('https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/TravelplannerV3/trip.json?key=9dcc27c7806146308e9a817303722483&originId=9192&destId=1002&searchForArrival=0')
        .then(function(response) {
        return response.json();
      })
      .then(function(departureData){
          console.log(departureData);
          // displayBooks(bookData);
      })
      .catch(function(error){
          console.log(error);
      });
}

fetchDepartures();


function displayDepartures(departureData){
    const weatherInfoElement = document.getElementById('weatherInfo');
    let weatherInfo = `
      <p> Weather: ${weatherData.weather[0].description} </p>
      <p> Temp: ${weatherData.main.temp} </p>
    `;
    weatherInfoElement.innerHTML = weatherInfo;
}
