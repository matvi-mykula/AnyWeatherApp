//this function accesses the open weather api

async function getWeather(api) {
  try {
    const response = await fetch(api, { mode: "cors" });
    if (response.status == 404) {
      console.log("404 not found: console logged");
      console.log("not a city");
      return null;
    }
    const weatherData = await response.json();
    // console.log(weatherData);

    const searchData = {
      cityName: weatherData["name"],
      temp: weatherData["main"]["temp"],
      weatherDescription: weatherData["weather"]["0"]["description"],
      windSpeed: weatherData["wind"],
    };
    console.log(searchData);
    return searchData;
    // console.log(api);
    // console.log(gifData.data.images.original.url);
    // if (!gifData.data.title.toLowerCase().includes(searchTerm)) {
    //   throw new Error();
    // }
  } catch (error) {
    console.log(error + "this is the error");
    displayError();
  }
}

function searchWeather(location) {
  const firstHalf = "http://api.openweathermap.org/data/2.5/weather?q=";
  const secondHalf = "&APPID=53579643522be2d6214a7bb6afc934d0";
  const api = firstHalf + location + secondHalf;
  const info = getWeather(api);
  if (!info) {
    displayError();
    return;
  }

  return info;
}
localStorage.setItem("favList", JSON.stringify([]));
const printData = async () => {
  const aBegin = timerStart();
  const cityInput = document.getElementById("input");

  const city =
    cityInput.value.charAt(0).toUpperCase() + cityInput.value.slice(1);
  console.log(city);
  if (!allLetter(city)) {
    cityInput.setAttribute("class", "invalid ");
  }
  //   if (printTruthy(city)) {
  const a = await searchWeather(city);
  console.log({ a });
  displayWeather(a);
  localStorage.setItem("currentCity", JSON.stringify(a));
  const timeElapsed = timerEnd(aBegin);
  console.log(timeElapsed);

  // show time elapsed to access API info
  const time = document.createElement("p");
  time.setAttribute("class", "timer");
  time.textContent =
    "This data was retrieved and displayed in " + timeElapsed + " milleseconds";
  document.getElementById("content").appendChild(time);
};

// api key = 53579643522be2d6214a7bb6afc934d0

// console.log(printData());

// check cities /// might not need this as get weather already looks for it
async function checkCities(input) {
  try {
    const response = await fetch("./city.list.json");
    // console.log(response);
    const responseData = await response.json();
    // console.log(responseData);
    if (JSON.stringify(responseData).toLowerCase().includes(input)) {
      console.log({ responseData });
      return true;
    } else {
      return false;
    }
  } catch {}
}

const printTruthy = async (input) => {
  const a = await checkCities(input);
  console.log({ a });
  return a;
};

// console.log(printTruthy("asdf"));
function displayError() {
  const content = document.getElementById("content");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  const errorMsg = document.createElement("p");
  errorMsg.textContent =
    "It Looks like that City/Town doesnt exist. Please try again.";
  content.appendChild(errorMsg);
}

function displayWeather(weatherData) {
  if (!weatherData) {
    displayError();
    return;
  }
  const content = document.getElementById("content");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  const city = document.createElement("p");
  city.textContent = weatherData["cityName"];
  const temp = document.createElement("p");
  temp.textContent =
    Math.round((9 / 5) * (weatherData["temp"] - 273) + 32) + " F";
  const weather = document.createElement("p");
  weather.textContent = weatherData["weatherDescription"];

  content.appendChild(city);
  content.appendChild(temp);
  content.appendChild(weather);

  changeWeather(weatherData);
}

//change theme/background
function changeWeather(weatherData) {
  const content = document.getElementById("content");
  content.className = "content";
  const currentWeather = weatherData["weatherDescription"];

  if (currentWeather == "clear sky") {
    content.classList.add("contentClearSky");
    const sunImg = document.createElement("img");
    sunImg.src = "happySun.png";
    content.appendChild(sunImg);
  }
  if (currentWeather == "few clouds") {
    const cloudImg = document.createElement("img");
    content.appendChild(cloudImg);
    content.classList.add("contentFewClouds");
  }
  if (currentWeather == "haze") {
    content.classList.add("contentHaze");
  }
  if (currentWeather == "scattered clouds") {
    content.classList.add("contentScatteredClouds");
    const cloudImg = document.createElement("img");
    cloudImg.src = "partialClouds.png";
  }
  if (currentWeather == "overcast clouds") {
    content.classList.add("contentOvercastClouds");
  }
  if (currentWeather.includes("clouds")) {
    content.classList.add("contentScatteredClouds");
    const cloudImg = document.createElement("img");
    cloudImg.src = "partialClouds.png";
    content.appendChild(cloudImg);
  }
  if (currentWeather.includes("storm")) {
    const stormImg = document.createElement("img");
    stormImg.src = "storm.png";
    content.appendChild(stormImg);
    content.classList.add("contentStorm");
  }
}

// form validation
function allLetter(inputtxt) {
  console.log("allLetters");
  console.log(inputtxt);
  if (inputtxt.length == 0) {
    return false;
  }
  var letters = /^[a-zA-Z\s]*$/;
  if (inputtxt.match(letters)) {
    return true;
  } else {
    alert("message");
    return false;
  }
}

function timerStart() {
  const start = Date.now();
  return start;
}

function timerEnd(aBegin) {
  console.log("timerEnd");
  const end = Date.now();
  const timeElapsed = end - aBegin;
  console.log(timeElapsed);
  return timeElapsed;
}

// need to add onclick to each dropdown option to display. might need entire dataset
function addToFav() {
  const currentCity = JSON.parse(localStorage.getItem("currentCity"));
  console.log(currentCity);
  if (currentCity) {
    console.log(currentCity);
    let favList = JSON.parse(localStorage.getItem("favList"));
    console.log(favList);
    favList.push(currentCity);
    localStorage.setItem("favList", JSON.stringify(favList));

    const select = document.getElementById("selectFav");
    while (select.children.length > 1) {
      select.removeChild(select.lastChild);
    }
    for (let i = 0; i < favList.length; i += 1) {
      let favOption = favList[i];
      let el = document.createElement("option");
      el.textContent = favOption["cityName"];
      el.value = favOption;
      // el.onselect = displayWeather(currentCity);
      select.appendChild(el);
    }
  }
  return;
}

function showFav() {
  const dataName = document.getElementById("selectFav");
  const selectFav = dataName.options[dataName.selectedIndex].text;
  const favList = JSON.parse(localStorage.getItem("favList"));
  favList.forEach(function (a) {
    if (a["cityName"] == selectFav) {
      displayWeather(a);
    }
  });
}

// const aBegining = timerStart();
// console.log(aBegining);
// setTimeout(function () {
//   timerEnd(aBegining);
// }, 3000);
