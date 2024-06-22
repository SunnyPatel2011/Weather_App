const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const apiKey = "fac3095279cbeb25586e5cdafc242ab0";

const search = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weather2 = document.querySelector(".weather2");
const weather3 = document.querySelector(".weather3");
const weather4 = document.querySelector(".weather4");
const resultbox = document.querySelector(".result-box");
const inputbox = document.getElementById("input-box");
const day0 = document.getElementById("daysname");
const day1 = document.getElementById("day1");
const day2 = document.getElementById("day2");
const day3 = document.getElementById("day3");

// Represent Daynames //
function time() {
    let now = new Date();
    let days = now.getDay();
    const dayNames = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayElements = [day0, day1, day2, day3];

    for (let i = 0; i < dayElements.length; i++) {
        const index = ((days + i) % 7) + 1;
        console.log(index);
        dayElements[i].textContent = dayNames[index - 1];
    }
}



// Function to set weather icon based on weather condition

function setWeatherIcon(weatherLocat, targetElement) {
    if (weatherLocat === "Clouds") {
        targetElement.src = "images/clouds.png";
    } else if (weatherLocat === "Clear") {
        targetElement.src = "images/clear.png";
    } else if (weatherLocat === "Rain") {
        targetElement.src = "images/rain.png";
    } else if (weatherLocat === "Drizzle") {
        targetElement.src = "images/drizzle.png";
    } else if (weatherLocat === "Mist") {
        targetElement.src = "images/mist.png";
    } else if (weatherLocat === "Snow") {
        targetElement.src = "images/snow.png";
    }
}

 // Function to fetch city name from json file //
 
async function fetchCities() {
    try {
        const response = await fetch('city.list.json');
        const cities =  response.json();
        return cities;
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
}

// Event listener for keydown events on input field
inputbox.addEventListener('keydown', (e) => {
    const key = e.key;
    const ul = resultbox.querySelector('ul');
    const selected = ul.querySelector('.selected');

    if (key === "ArrowUp") { 
        if (selected) {
            const prev = selected.previousElementSibling;
            if (prev) {
                selected.classList.remove('selected');
                prev.classList.add('selected');
            }
        } else {
            const last = ul.lastElementChild;
            if (last) {
                last.classList.add('selected');
            }
        }   
    } else if (key === "ArrowDown") { 
        if (selected) {
            const next = selected.nextElementSibling;
            if (next) {
                selected.classList.remove('selected');
                next.classList.add('selected');
            }
         } 
        else {
            const first = ul.firstElementChild;
            if (first) {
                first.classList.add('selected');
            }
        }
        e.preventDefault(); 
    } else if(key === "Enter") {
        if (selected) {
            selectCity(selected.innerHTML);
        }
        else{
            alert("Please input something");
        }
    }
});


/// Function to adjust city name in input feild ///

async function fetchCitiesAndUpdateUI() {
    try {
        const cities = await fetchCities();
        resultbox.style.display = 'none';
        inputbox.addEventListener('input', () => {
            const inputValue = inputbox.value.toLowerCase();
            if (inputValue !== '') {
                const filteredCities = cities.filter(city => city.name.toLowerCase().startsWith(inputValue));
                display(filteredCities);
            } else {
                resultbox.style.display = 'none';
            }

        });
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

// Function to display city name //

function display(cities) {
    const ul = resultbox.querySelector('ul');
    ul.textContent = '';
    if (cities.length > 0) {
        resultbox.style.display = 'block';
        cities.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city.name;
            li.addEventListener('click', () => selectCity(city.name));
            ul.appendChild(li);
        });
    } else {
        resultbox.style.display = 'none';
    }
}
 
// Function used after selecting the city name in input feild //

function selectCity(cityName) {
    inputbox.value = cityName;
    resultbox.style.display = 'none';
}

// Function to fetch Weather from api //

async function checkweather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();
        console.log(data);
        if (data.cod == "404") {
            alert("Please enter a valid Input");
            return;
        }

        document.querySelector(".city").innerHTML = data.city.name;
        document.querySelector(".temp").innerHTML = Math.floor(data.list[1].main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.list[1].main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.list[1].wind.speed + " km/h";

        document.querySelector(".temp2").innerHTML = Math.floor(data.list[9].main.temp) + "°c"
        document.querySelector(".temp3").innerHTML = Math.floor(data.list[17].main.temp) + "°c"
        document.querySelector(".temp4").innerHTML = Math.floor(data.list[25].main.temp) + "°c"

        setWeatherIcon(data.list[1].weather[0].main, weatherIcon);
        setWeatherIcon(data.list[9].weather[0].main, weather2);
        setWeatherIcon(data.list[17].weather[0].main, weather3);
        setWeatherIcon(data.list[25].weather[0].main, weather4);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

searchBtn.addEventListener("click", () => {
    const cityName = search.value;
    if (cityName !== '') {
        checkweather(cityName);
        search.value = '';
        resultbox.style.display = 'none';
        time();
    }
});

fetchCitiesAndUpdateUI();