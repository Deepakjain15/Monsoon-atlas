const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealElements = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll("[data-filter-button]");
const destinationCards = document.querySelectorAll("[data-category]");
const faqQuestions = document.querySelectorAll(".faq-question");
const yearTargets = document.querySelectorAll("[data-year]");
const budgetForm = document.querySelector("#budget-form");
const weatherCards = document.querySelectorAll("[data-weather-card]");
const weatherRefreshButton = document.querySelector("#refresh-weather");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (siteNav) {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  siteNav.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
}

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

if (filterButtons.length > 0 && destinationCards.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filterButton;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      destinationCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.hidden = !matches;
      });
    });
  });
}

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.closest(".faq-item");
    const isOpen = item.classList.toggle("open");
    question.setAttribute("aria-expanded", String(isOpen));
  });
});

yearTargets.forEach((target) => {
  target.textContent = new Date().getFullYear();
});

if (budgetForm) {
  const totalOutput = document.querySelector("#budget-total");
  const noteOutput = document.querySelector("#budget-note");
  const stayOutput = document.querySelector("#stay-cost");
  const travelOutput = document.querySelector("#travel-cost");
  const foodOutput = document.querySelector("#food-cost");
  const recommendationTitle = document.querySelector("#trip-match-title");
  const recommendationText = document.querySelector("#trip-match-text");

  const formatRupees = (value) => `Rs. ${value.toLocaleString("en-IN")}`;
  const routeSuggestions = {
    coast: {
      slow: {
        title: "Udupi Blue Hour",
        text: "This route suits a gentle coastal weekend with light exploration, family-friendly pacing, and balanced travel cost."
      },
      balanced: {
        title: "Gokarna Drift",
        text: "A coastal route with enough movement, beach variety, and scenic payoff without becoming too expensive."
      },
      active: {
        title: "Gokarna Drift",
        text: "The cliff walk and beach-hopping make Gokarna a stronger fit when you want a more active coastal plan."
      }
    },
    hills: {
      slow: {
        title: "Coorg Rain Trail",
        text: "A calm hill route gives the best mix of comfort, scenic breaks, and slow travel energy for your current choices."
      },
      balanced: {
        title: "Chikmagalur Fold",
        text: "This hill route works well for a balanced weekend because it combines scenic drives, short hikes, and strong photography value."
      },
      active: {
        title: "Chikmagalur Fold",
        text: "For higher exploration energy, Chikmagalur offers more movement through drives, waterfalls, and short trail stops."
      }
    },
    heritage: {
      slow: {
        title: "Mysuru Afterglow",
        text: "Mysuru fits a relaxed heritage weekend with easier city movement, architecture, and food-led exploration."
      },
      balanced: {
        title: "Mysuru Afterglow",
        text: "This is the best balanced culture-first route because it keeps the pace smooth while still offering rich places to explore."
      },
      active: {
        title: "Hampi Stone Echo",
        text: "Hampi is the stronger match for active heritage travel because it rewards walking, cycling, and longer site exploration."
      }
    }
  };

  const getMoodKey = (moodValue) => {
    if (moodValue === 800) return "coast";
    if (moodValue === 1000) return "hills";
    return "heritage";
  };

  const updateBudget = () => {
    const travelers = Number(document.querySelector("#travelers").value) || 1;
    const days = Number(document.querySelector("#days").value) || 2;
    const stay = Number(document.querySelector("#stay").value) || 1200;
    const mood = Number(document.querySelector("#mood").value) || 800;
    const energy = document.querySelector("#energy").value || "slow";

    const stayCost = travelers * stay * days;
    const travelCost = mood * travelers;
    const foodCost = travelers * days * 200;
    const total = stayCost + travelCost + foodCost;

    totalOutput.textContent = formatRupees(total);
    stayOutput.textContent = formatRupees(stayCost);
    travelOutput.textContent = formatRupees(travelCost);
    foodOutput.textContent = formatRupees(foodCost);

    const stayText = document.querySelector("#stay option:checked").textContent.toLowerCase();
    const moodText = document.querySelector("#mood option:checked").textContent.toLowerCase();
    noteOutput.textContent =
      `Based on ${travelers} traveler${travelers > 1 ? "s" : ""}, ${days} day${days > 1 ? "s" : ""}, ${stayText}, and a ${moodText}.`;

    const moodKey = getMoodKey(mood);
    const suggestion = routeSuggestions[moodKey][energy];
    if (recommendationTitle && recommendationText) {
      recommendationTitle.textContent = suggestion.title;
      recommendationText.textContent = suggestion.text;
    }
  };

  budgetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateBudget();
  });

  budgetForm.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("change", updateBudget);
  });

  updateBudget();
}

if (weatherCards.length > 0) {
  const weatherSummaryTitle = document.querySelector("#weather-summary-title");
  const weatherSummaryText = document.querySelector("#weather-summary-text");
  const weatherCodeMap = {
    0: "Clear sky",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Strong showers",
    95: "Thunderstorm"
  };

  const formatTemp = (value) => `${Math.round(value)}°C`;
  const formatPercent = (value) => `${Math.round(value)}%`;
  const formatWind = (value) => `${Math.round(value)} km/h`;
  const getWeatherLabel = (code) => weatherCodeMap[code] || "Mixed conditions";
  const computeTripScore = ({ rainChance, windSpeed, currentTemp }) => {
    const rainPenalty = rainChance * 0.7;
    const windPenalty = windSpeed * 0.8;
    const heatPenalty = currentTemp > 32 ? (currentTemp - 32) * 3 : 0;
    return Math.max(0, 100 - rainPenalty - windPenalty - heatPenalty);
  };

  const renderWeatherError = (card) => {
    const status = card.querySelector("[data-weather-status]");
    const temp = card.querySelector("[data-weather-temp]");
    const range = card.querySelector("[data-weather-range]");
    const rain = card.querySelector("[data-weather-rain]");
    const wind = card.querySelector("[data-weather-wind]");

    status.textContent = "Forecast unavailable right now.";
    temp.textContent = "--";
    range.textContent = "--";
    rain.textContent = "--";
    wind.textContent = "--";
  };

  const loadWeather = async () => {
    const results = await Promise.all(
      Array.from(weatherCards).map(async (card) => {
        const latitude = card.dataset.lat;
        const longitude = card.dataset.lon;
        const name = card.dataset.name;
        const status = card.querySelector("[data-weather-status]");
        const temp = card.querySelector("[data-weather-temp]");
        const range = card.querySelector("[data-weather-range]");
        const rain = card.querySelector("[data-weather-rain]");
        const wind = card.querySelector("[data-weather-wind]");

        status.textContent = "Fetching live forecast...";

        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
          "&current=temperature_2m,weather_code,wind_speed_10m" +
          "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
          "&forecast_days=1&timezone=auto";

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Weather request failed for ${name}`);
          }

          const data = await response.json();
          const currentTemp = data.current.temperature_2m;
          const weatherCode = data.current.weather_code;
          const windSpeed = data.current.wind_speed_10m;
          const minTemp = data.daily.temperature_2m_min[0];
          const maxTemp = data.daily.temperature_2m_max[0];
          const rainChance = data.daily.precipitation_probability_max[0];
          const score = computeTripScore({ rainChance, windSpeed, currentTemp });

          status.textContent = getWeatherLabel(weatherCode);
          temp.textContent = formatTemp(currentTemp);
          range.textContent = `${formatTemp(minTemp)} - ${formatTemp(maxTemp)}`;
          rain.textContent = formatPercent(rainChance);
          wind.textContent = formatWind(windSpeed);

          return { card, name, score, rainChance, currentTemp, weatherCode };
        } catch (error) {
          renderWeatherError(card);
          return null;
        }
      })
    );

    weatherCards.forEach((card) => card.classList.remove("is-best"));
    const validResults = results.filter(Boolean);

    if (validResults.length === 0) {
      if (weatherSummaryTitle && weatherSummaryText) {
        weatherSummaryTitle.textContent = "Forecast could not be loaded";
        weatherSummaryText.textContent =
          "The live API is currently unavailable, but the rest of the website remains fully functional.";
      }
      return;
    }

    validResults.sort((left, right) => right.score - left.score);
    const best = validResults[0];
    best.card.classList.add("is-best");

    if (weatherSummaryTitle && weatherSummaryText) {
      weatherSummaryTitle.textContent = `${best.name} looks strongest right now`;
      weatherSummaryText.textContent =
        `${getWeatherLabel(best.weatherCode)} with around ${Math.round(best.currentTemp)}°C and ` +
        `${Math.round(best.rainChance)}% rain chance. This makes it the cleanest live pick for a short weekend route.`;
    }
  };

  loadWeather();

  if (weatherRefreshButton) {
    weatherRefreshButton.addEventListener("click", loadWeather);
  }
}
