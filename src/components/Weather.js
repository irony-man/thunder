import {React, useEffect, useState} from "react";
import axios from 'axios';
import codes from '../wcodes.json';
import sunny from "../images/sunny.jpg";
import rainy from "../images/rainy.jpg";
import snowy from "../images/snowy.jpg";
import overcast from "../images/overcast.jpg";
import './Weather.css';
import WeatherChart from "./WeatherChart";

function Weather() {
  const [search, setSearch] = useState([]);
  const [input, setInput] = useState("");
  const [focus, setFocus] = useState(false);
  const [city, setCity] = useState([]);
  const [weather, setWeather] = useState({current_weather:{}, daily:{}, hourly:{
    time:[], temperature_2m: [], rain: [], snowfall: []
  }});
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const long = queryParams.get('long');
    const lat = queryParams.get('lat');
    if(lat && long){
      selectCity(0, {lat, long});
    }
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
                <div className="weather-type hide-mb">
                  <i className={weather.current_weather.weathercode !== undefined?codes[weather.current_weather.weathercode].icon:"fas fa-cloud"}></i>
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
                <button className="city-submit btn btn-light" type="submit">
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
                  <p>Elevation: <span>{city.elevation || "N/A"}</span></p>
                  <p>Population: <span>{city.population || "N/A"}</span></p>
                  <p>Timezone: <span>{city.timezone || "N/A"}</span></p>
                </div>
              </div>
              <button type="button" className="btn btn-outline-light weather-det-button hide-mb hover-text" data-toggle="modal" data-target="#exampleModalCenter">
                Detailed Weather!! <span className="tooltip-text mt-3">Shows data only on large screens!!</span>
              </button>
            </div>
            <p className="mt-5 text-center">Developed by Shivam Rai</p>
          </div>
        </div>
        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <WeatherChart value={weather} city={city.name} />
              </div>
              <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Weather;
