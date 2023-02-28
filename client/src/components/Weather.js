import axios from "axios";
import React, { useEffect, useState } from "react";
import { geoApiOptions, GEO_API_URL, WEATHER_API_KEY, WEATHER_API_URL } from "../apis/weatherApi";

import { allImages } from "../images/icons/allImages";
import { daysOfWeek } from "../tools/constants.js/daysOfWeek";
import Loading from "./Loading";
import NoWeather from "../images/no-weather.png";

const Weather = ({ location }) => {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(null);

  const weather = [];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${GEO_API_URL}/cities?minPopulation=50000&namePrefix=${location}`, geoApiOptions);
      const { latitude: lat, longitude: lon } = response.data.data[0];

      const response2 = await axios.get(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
      const data2 = response2.data.list;
      setData(data2);

      setIsLoaded(true);
    };
    fetchData().catch((err) => {
      console.log(err);
      setIsLoaded(false);
    });
  }, []);

  if (data) {
    const newDayIndex = data.findIndex((elem) => elem.dt_txt.split(" ")[1].includes("00:00:00"));
    // const newDayIndex = 0;
    if (newDayIndex !== 0) {
      weatherForOneDay(0, newDayIndex);
    }

    for (let i = newDayIndex; i < data.length && i + 8 <= data.length; i += 8) {
      weatherForOneDay(i, i + 8);
    }
  }

  function weatherForOneDay(indexStart, indexEnd) {
    const oneDayData = data.slice(indexStart, indexEnd);
    const weatherForDay = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, icon: "", dayOfWeek: "" };
    const date = new Date(oneDayData[0].dt_txt);
    weatherForDay.dayOfWeek = daysOfWeek[date.getDay()];

    oneDayData.forEach((elem) => {
      if (elem.main.temp_min < weatherForDay.min) {
        weatherForDay.min = elem.main.temp_min;
      }
      if (elem.main.temp_max > weatherForDay.max) {
        weatherForDay.max = elem.main.temp_max;
      }

      // Find the right icon (tell if it's raining or snowing)
      if (elem?.rain) {
        weatherForDay.icon = allImages.img09d;
      }
      if (elem?.snow) {
        weatherForDay.icon = allImages.img13d;
      }
    });

    if (!weatherForDay.icon) {
      const howSunny = { img01d: 0, img02d: 0, img03d: 0, img04d: 0 };
      oneDayData.forEach((elem) => {
        const keyToChange = Object.keys(howSunny).find((key) => key.includes(elem.weather[0].icon));
        if (keyToChange) {
          howSunny[keyToChange] = howSunny[keyToChange] + 1;
        }
      });
      const max = Math.max(...Object.values(howSunny));
      const typeOfIcon = Object.keys(howSunny).find((key) => howSunny[key] === max);
      weatherForDay.icon = allImages[typeOfIcon];
    }
    weather.push(weatherForDay);
  }

  if (isLoaded) {
    return (
      <div className="weather">
        <div className="weather__city">{location}</div>
        <div className="weather__icon-temperature">
          <div className="weather__icon-temperature__icon-div">
            <img src={weather[0].icon} alt="" />
          </div>
          <div className="weather__icon-temperature__min-max">
            <div>{Math.round(weather[0].min)} °C</div>
            <div>{Math.round(weather[0].max)} °C</div>
          </div>
        </div>
        {weather.slice(1).map((weatherDay, index) => {
          return (
            <div className="weather__forecast" key={index}>
              <div className="weather__forecast__icon-div">
                <img src={weatherDay.icon} alt="" />
              </div>
              <div className="weather__forecast__day">{weatherDay.dayOfWeek}</div>
              <span className="weather__forecast__min">{Math.round(weatherDay.min)} °C</span>
              <span>/</span>
              <span className="weather__forecast__max">{Math.round(weatherDay.max)} °C</span>
            </div>
          );
        })}
      </div>
    );
  } else if (isLoaded === null) {
    return <Loading />;
  } else {
    return (
      <div className="weather">
        <div className="weather__no-weather">
          <img src={NoWeather} alt="" />
          <p>Unable to find the weather for the current location</p>
        </div>
      </div>
    );
  }
};

export default Weather;
