
var cities = [];


function displayCityWeather() {
  
  var city = $(this).attr("data-name") || localStorage.getItem('cityKey');
  var currentURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=c475eb02407571ed89e1cc41db9cc7a8";
  var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=c475eb02407571ed89e1cc41db9cc7a8";
  

  $("#weather").empty();
  
  $.ajax({
    url: currentURL,
    method: "GET"
  }).then(function (response) {
    var time = new Date(response.dt * 1000)
    var lat = response.coord.lat
    var lon = response.coord.lon
    var icon = response.weather[0].icon
    var icon2 = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    $("#weather").append('<div id="currentWeather"></div>')
    $("#currentWeather").append(`<h2>${response.name}</h2>`)
    $("#currentWeather").append(`<p>` + time.toDateString() + `</p>`)
    $("#currentWeather").append(`<img src=${icon2}>`)
    $("#currentWeather").append(`<p>Temperature (F): ${(((response.main.temp - 273.15) * 1.8) + 32).toFixed(2)}</p>`)
    $("#currentWeather").append(`<p>Humidity: ${response.main.humidity}%</p>`)
    $("#currentWeather").append(`<p>Wind Speed: ${response.wind.speed} m/s</p>`)
    console.log(response)

    var currentUv = "http://api.openweathermap.org/data/2.5/uvi?appid=c475eb02407571ed89e1cc41db9cc7a8&lat=" + lat + "&lon=" + lon

    $.ajax({
      url: currentUv,
      method: "GET"
    }).then(function (response) {
      $("#currentWeather").append(`<div id="wrapper" class="wrapper"></div>`)
      $("#wrapper").append(`<p id="uv">UV Index: ${response.value}</p>`)
      if (response.value >= 0 && response.value < 3) {
        $("#uv").attr("class", "low")
      } else if (response.value >= 3 && response.value <= 5) {
        $("#uv").attr("class", "moderate")
      } else if (response.value > 5 && response.value <= 7) {
        $("#uv").attr("class", "high")
      } else if (response.value > 7) {
        $("#uv").attr("class", "very-high")
      }
    })

    $.ajax({
      url: fiveDayURL,
      method: "GET"
    }).then(function (response) {
      var x = 5
      var futureDays = ["firstDay", "secondDay", "thirdDay", "fourthDay", "fifthDay"]
      var cards = ["card1", "card2", "card3", "card4", "card5"]
      $("#weather").append('<div class="row text-center"></div>')
      for (i = 0; i < 5; i++) {
        var timed = new Date(response.list[x].dt_txt)
        var futureIcon = response.list[x].weather[0].icon
        var futureIcon2 = "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png"       
        $(".row").append(`<div class="card" id="${cards[i]}"></div>`)
        $(`#${cards[i]}`).append(`<img src=${futureIcon2}>`);
        $(`#${cards[i]}`).append(`<div id="${futureDays[i]}"></div>`)
        $(`#${futureDays[i]}`).append(`<h3 scope="row">${timed.toDateString()}</h3>`);    
        $(`#${futureDays[i]}`).append(`<p>Temperature (F): ${(((response.list[x].main.temp - 273.15) * 1.8) + 32).toFixed(2)}</p>`)
        $(`#${futureDays[i]}`).append(`<p>Humidity: ${response.list[x].main.humidity}%<p>`)
        x = x + 8
      }
    })
  })
}

function renderButtons() {
  $("#buttons-view").empty();
  for (var i = 0; i < cities.length; i++) {
    var a = $("<button>");
    a.addClass("city");
    a.attr("data-name", cities[i]);
    a.text(cities[i]);
    $("#buttons-view").append(a);
  }
}

$("#addCity").on("click", function (event) {
  event.preventDefault();
  var city = $("#cityInput").val().trim();
  cities.push(city);
  localStorage.setItem('cityKey', city)
  renderButtons();
});

$(document).on("click", ".city", displayCityWeather);
renderButtons();
displayCityWeather();
