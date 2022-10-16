import {React, useEffect, useState} from "react";
import axios from 'axios';
import codes from '../wcodes.json';
import sunny from "../images/sunny.jpg";
import rainy from "../images/rainy.jpg";
import snowy from "../images/snowy.jpg";
import overcast from "../images/overcast.jpg";
import './Weather.css';

function Weather() {
  const [search, setSearch] = useState([]);
  const [input, setInput] = useState("");
  const [focus, setFocus] = useState(false);
  const [city, setCity] = useState([]);
  const [weather, setWeather] = useState({current_weather:{}, daily:{}});
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const long = queryParams.get('long');
    const lat = queryParams.get('lat');
    if(lat && long){
      selectCity(0, {lat, long});
    }
    else alert("Something went wrong!!");
  }, []);
  useEffect(() => {
    const bgHome = document.getElementById('weather-page');
    const code = weather.current_weather.weathercode;
    if(code < 3) {
      bgHome.style.backgroundImage = `url(${sunny})`;
    } else if(code >=3 && code < 50) {
      bgHome.style.backgroundImage = `url(${overcast})`;
    } else if(code > 50 && code < 70) {
      bgHome.style.backgroundImage = `url(${rainy})`;
    } else {
      bgHome.style.backgroundImage = `url(${snowy})`;
    }
  }, [weather.current_weather]);

  const loseFocus = () => {
    setTimeout(() => {
      setFocus(false);
    }, 500);
  }

  const searchResult = (e) => {
    const value = e.target.value;
    setInput(value);
    setFocus(true);
    if(value.length > 2) {
      axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=4`)
      .then(res => {
        if(res.data.results) {
          setSearch(res.data.results);
        }
      }).catch(err => console.log(err))
    } else {
      setSearch([]);
      setFocus(0);
    }
  }

  const selectCity = (idx, data) => {
    const {lat, long} = data;
    setFocus(0);
    const ci = search[idx];
    if(ci) {
      setCity(ci);
      setInput(ci.name);
    }
    axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat || ci.latitude}&longitude=${long || ci.longitude}&hourly=temperature_2m,rain,snowfall,weathercode&daily=sunrise,sunset&current_weather=true&timezone=auto`)
    .then(res => {
      setWeather(res.data);
    }).catch(err => console.log(err))
  }

  const submitCity = (e) => {
    e.preventDefault();
    selectCity(0, {});
  }
  return (
    <>
      <div id="weather-page">
        <div className="row m-0">
          <div className="col-lg-8 cur-weather">
            <div className="weather-desc">
              <div className="weather-details">
                <div className="weather-temp">
                  <h1 className="weather-temp-value">
                    {weather.current_weather.temperature?weather.current_weather.temperature:"N/A"}
                  </h1>
                  <p className="weather-degree">o</p>
                </div>
                <div className="weather-type">
                  <i className={weather.current_weather.weathercode !== undefined?codes[weather.current_weather.weathercode].icon:"fas fa-cloud fa-4x"}></i>
                  <p className="mt-2">{weather.current_weather.weathercode !== undefined?codes[weather.current_weather.weathercode].type:"N/A"}</p>
                </div>
              </div>
              <div className="weather-city-desc">
                <h1 className="weather-city">
                  {city.name?city.name.split(' ').slice(0, 2).join(' '):"N/A"}
                </h1>
                <div className="d-flex gap-4">
                  <p className="hover-text">
                    <i className="fas fa-wind"></i> : {weather.current_weather.windspeed?weather.current_weather.windspeed:"N/A"}
                    <span className="tooltip-text">Windspeed!!</span>
                  </p>
                  <p className="hover-text">
                    <i className="fas fa-cloud-sun"></i> {weather.daily.sunrise && weather.daily.sunset?weather.daily.sunrise[0].substr(11)+" to "+weather.daily.sunset[0].substr(11):"N/A"}
                    <span className="tooltip-text">Sunrise to Sunset</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 weather-det">
            <div className="weather-det-info">
              <form className="search-city" onSubmit={submitCity}>
                <div className="city-input">
                  <input type="text" placeholder="Search Location"
                  value={input} onChange={searchResult} onFocus={() => setFocus(true)} onBlur={loseFocus} autoFocus></input>
                  {focus?<div className="search-results">
                    {search.map((res, idx) => (
                      <div key={res.id}>
                      <p className="search-results-ind p" onClick={() => selectCity(idx, {})}>{res.name + (res.admin1?", " + res.admin1:"")}</p>
                      <hr/>
                      </div>
                    ))}
                  </div>:<></>}
                </div>
                <button className="city-submit" type="submit">
                  <i className="fas fa-search fa-lg"></i>
                </button>
              </form>
              <div className="city-details">
                <p className="h6">City Details</p>
                <div className="city-desc">
                  <p>Name: <span>{city.name || "N/A"}</span></p>
                  <p>State: <span>{city.admin1 || "N/A"}</span></p>
                  <p>Country: <span>{city.country || "N/A"}</span></p>
                  <p>Longitude: <span>{city.longitude || "N/A"}</span></p>
                  <p>Latitude: <span>{city.latitude || "N/A"}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Weather;
