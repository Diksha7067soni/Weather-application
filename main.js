// =====================
// City List
// =====================
const cities = [
  "Bhopal",
  "Indore",
  "Jabalpur",
  "Gwalior",
  "Ujjain",
  "Sagar",
  "Dewas",
  "Satna",
  "Ratlam",
  "Rewa",
  "Katni",
  "Singrauli",
  "Burhanpur",
  "Khandwa",
  "Bhind",
  "Chhindwara",
  "Guna",
  "Shivpuri",
  "Vidisha",
  "Chhatarpur",
  "Damoh",
  "Mandsaur",
  "Neemuch",
  "Pithampur",
  "Narmadapuram",
  "Itarsi",
  "Sehore",
  "Seoni",
  "Betul",
  "Balaghat",
  "Tikamgarh",
  "Shahdol",
  "Sidhi",
  "Datia",
  "Morena",
  "Sheopur",
  "Rajgarh",
  "Raisen",
  "Umaria",
  "Ashoknagar",
  "Dhar",
  "Alirajpur",
  "Barwani",
  "Khargone",
  "Anuppur",
  "Mandla",
  "Harda",
];

// =====================
// City → Coordinates
// =====================
const cityCoordinates = {
  Bhopal: { lat: 23.2599, lon: 77.4126 },
  Indore: { lat: 22.7196, lon: 75.8577 },
  Jabalpur: { lat: 23.1815, lon: 79.9864 },
  Gwalior: { lat: 26.2183, lon: 78.1828 },
  Ujjain: { lat: 23.1765, lon: 75.7885 },
  Sagar: { lat: 23.8388, lon: 78.7378 },
  Dewas: { lat: 22.9623, lon: 76.0508 },
  Satna: { lat: 24.6005, lon: 80.8322 },
  Rewa: { lat: 24.5373, lon: 81.3042 },
  Ratlam: { lat: 23.3315, lon: 75.0367 },
};

// =====================
// DOM Elements
// =====================
const input = document.getElementById("searchCity");
const list = document.getElementById("cityList");
const searchBtn = document.getElementById("searchBtn");
const weatherBox = document.getElementById("weatherBox");
const searchBox = document.querySelector(".search_box");

// =====================
// Dropdown
// =====================
function renderList(filter = "") {
  list.innerHTML = "";
  if (filter.trim().length < 2) {
    list.style.display = "none";
    return;
  }
  const filtered = cities.filter((c) =>
    c.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach((city) => {
    const div = document.createElement("div");
    div.textContent = city;
    div.onclick = () => {
      input.value = city;
      list.style.display = "none";
      getWeather(city);
    };
    list.appendChild(div);
  });
  list.style.display = "block";
}
input.addEventListener("input", () => renderList(input.value));
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) list.style.display = "none";
});

// =====================
// Weather Mapping
// =====================
function getWeatherText(code) {
  const map = {
    0: { text: "Clear Sky", icon: "☀️" },
    1: { text: "Mainly Clear", icon: "🌤️" },
    2: { text: "Partly Cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Fog", icon: "🌫️" },
    61: { text: "Rain", icon: "🌧️" },
    71: { text: "Snow", icon: "❄️" },
    95: { text: "Thunderstorm", icon: "⛈️" },
  };
  return map[code] || { text: "Unknown", icon: "❓" };
}

// =====================
// Loading
// =====================
function showLoading() {
  weatherBox.innerHTML = `
    <div class="weather-cards">
      <div class="weather-card skeleton"></div>
      <div class="weather-card skeleton"></div>
      <div class="weather-card skeleton"></div>
    </div>`;
}

// =====================
// Weather Fetch
// =====================
async function getWeather(city) {
  if (!cityCoordinates[city]) return;
  const { lat, lon } = cityCoordinates[city];
  showLoading();

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=4&timezone=auto`
  );
  const data = await res.json();
  const current = data.current_weather;
  const weather = getWeatherText(current.weathercode);

  let html = `
    <h2>Weather in ${city}</h2>
    <div class="weather-cards">
      <div class="weather-card"><h4>🌡 Temp</h4><p>${current.temperature}°C</p></div>
      <div class="weather-card"><h4>${weather.icon} Condition</h4><p>${weather.text}</p></div>
      <div class="weather-card"><h4>🌬 Wind</h4><p>${current.windspeed} km/h</p></div>
    </div>
    <h3>Next 3 Days</h3>
    <div class="weather-cards">`;

  for (let i = 1; i <= 3; i++) {
    const d = getWeatherText(data.daily.weathercode[i]);
    html += `
      <div class="weather-card">
        <h4>${d.icon} ${data.daily.time[i]}</h4>
        <p>${d.text}</p>
        <p>Max: ${data.daily.temperature_2m_max[i]}°C</p>
        <p>Min: ${data.daily.temperature_2m_min[i]}°C</p>
      </div>`;
  }
  weatherBox.innerHTML = html + "</div>";
}

// =====================
// Search
// =====================
searchBtn.onclick = () => {
  if (cityCoordinates[input.value]) getWeather(input.value);
};
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// =====================
// Background Carousel
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const imgs = [
    "assets/1.png",
    "assets/2.png",
    "assets/3.png",
    "assets/4.png",
    "assets/5.png",
  ];
  let i = 0;
  setInterval(() => {
    searchBox.style.backgroundImage = `url('${imgs[i]}')`;
    i = (i + 1) % imgs.length;
  }, 2500);
});

// =====================
// AUTO LOCATION (IMPROVED)
// =====================
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function detectNearestCity(lat, lon, accuracy) {
  if (accuracy > 3000) return; // ignore bad accuracy
  let nearest = null,
    min = Infinity;
  for (const city in cityCoordinates) {
    const c = cityCoordinates[city];
    const d = getDistance(lat, lon, c.lat, c.lon);
    if (d < min) {
      min = d;
      nearest = city;
    }
  }
  if (nearest) {
    input.value = nearest;
    getWeather(nearest);
  }
}

function detectLocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      detectNearestCity(
        pos.coords.latitude,
        pos.coords.longitude,
        pos.coords.accuracy
      );
    },
    () => {},
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    }
  );
}

// REQUIRED USER INTERACTION
document.addEventListener("touchstart", detectLocation, { once: true });
document.addEventListener("click", detectLocation, { once: true });
