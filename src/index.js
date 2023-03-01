const API_KEY = "511f8a79d61754bf6d85e93d46b60674";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Get references to the HTML elements we need to interact with
const form = document.querySelector("form");
const searchButton = document.querySelector("button");
const currentTime = document.querySelector("#current-time");
const options = {
  weekday: "long",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
};
const locationNameElement = document.querySelector("#location-name");
const weatherIconElement = document.querySelector("#weather-icon");
const temperatureElement = document.querySelector("h3");
const humidityElement = document.createElement("li");
const windElement = document.createElement("li");

setInterval(() => {
  const now = new Date();
  const dateString = now.toLocaleString("en-US", options);
  currentTime.textContent = dateString;
}, 1000);

// Add the new list items we just created to the unordered list in the HTML
const currentWeatherList = document.querySelector("ul");
currentWeatherList.appendChild(humidityElement);
currentWeatherList.appendChild(windElement);

// Get reference to the location input field
const locationInput = document.querySelector("#form1");

// Add event listener to clear the location name, weather icon, and weather information when the user starts typing
locationInput.addEventListener("input", () => {
  locationNameElement.textContent = "";
  weatherIconElement.src = "";
  temperatureElement.textContent = "";
  humidityElement.textContent = "";
  windElement.textContent = "";
});

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const locationName = form.elements["form1"].value;
  const url = `${BASE_URL}weather?q=${locationName}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Update the location name and weather icon in the HTML with the new data
      locationNameElement.textContent = `${data.name}, ${data.sys.country}`;
      const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherIconElement.src = iconUrl;

      // Update the temperature, humidity, and wind information in the HTML with the new data
      temperatureElement.textContent = `${Math.round(
        data.main.temp
      )}°C / ${Math.round((data.main.temp * 9) / 5 + 32)}°F`;
      humidityElement.textContent = `Humidity ${data.main.humidity}%`;
      windElement.textContent = `Wind ${data.wind.speed} km/h`;

      // Fetch the forecast data for the given location
      getForecast(locationName)
        .then((forecastData) => {
          // Clear the existing forecast list
          const forecastList = document.querySelector("#forecast-list");
          forecastList.innerHTML = "";

          // Loop through the forecast data for the next 5 days and add it to the forecast list
          for (let i = 0; i < forecastData.length; i += 8) {
            const forecastItem = forecastData[i];

            const forecastItemDate = new Date(forecastItem.dt * 1000);
            const forecastItemDateString = forecastItemDate.toLocaleDateString(
              "en-US",
              { weekday: "long" }
            );

            const forecastItemIconUrl = `http://openweathermap.org/img/wn/${forecastItem.weather[0].icon}.png`;

            const forecastItemTemp = Math.round(forecastItem.main.temp);

            const forecastItemElement = document.createElement("li");
            forecastItemElement.innerHTML = `
              <img src="${forecastItemIconUrl}" alt="${forecastItem.weather[0].description}" />
              <div>${forecastItemDateString}</div>
              <div>${forecastItemTemp}°C</div>
            `;
            forecastList.appendChild(forecastItemElement);
          }
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
});
function getForecast(locationName) {
  const url = `${BASE_URL}forecast?q=${locationName}&appid=${API_KEY}&units=metric`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.list)
    .catch((error) => console.error(error));
}
