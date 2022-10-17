import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();
    const getLocation = () => {
        if (navigator.geolocation) {navigator.permissions
            .query({ name: "geolocation" })
            .then(function (result) {
                if (result.state === "granted") {
                    navigator.geolocation.getCurrentPosition((position)=> {
                        const p = position.coords;
                        navigate(`/weather?lat=${p.latitude}&long=${p.longitude}`);
                    })
                } else if (result.state === "denied") {
                    alert("Location access denied!!");
                }
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    return (
        <>
            <div id='home-page'>
                <div className='home-det'>
                    <h1 className='display-3'>Thunder</h1>
                    <p>The Weather App</p>
                    <div className='home-links'>
                        <Link className="btn btn-secondary" to="/weather">Get started!!</Link>
                        <button className="btn btn-primary" onClick={getLocation}>Get weather of your location!!</button>
                    </div>
                </div>
                <footer>Developed by Shivam Rai</footer>
            </div>
        </>
    );
};

export default Home;