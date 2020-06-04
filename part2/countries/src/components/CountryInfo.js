import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherInfo from './WeatherInfo';

const CountryInfo = ({ country }) => {
  //   console.log(country);
  const [weather, setWeather] = useState(null);

  const { name, capital, population, languages, flag } = country[0];

  useEffect(() => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${capital}`
      )
      .then(response => {
        // console.log(response.data);
        setWeather(response.data);
      });
  }, [capital]);

  return (
    <div>
      <h2>{name}</h2>
      <p>capital {capital}</p>
      <p>population {population}</p>
      <h3>languages</h3>
      <ul>
        {languages.map(language => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <img src={`${flag}`} alt={`${name}'s flag`} height={250} width={375} />
      <WeatherInfo weather={weather} />
    </div>
  );
};

export default CountryInfo;
