import React from 'react';

const WeatherInfo = ({ weather }) => {
  //   console.log(weather);

  if (weather === null) {
    return <div>loading weather...</div>;
  }

  return (
    <div>
      <h3>Weather in {weather.location.name}</h3>
      <p>
        <strong>temperature:</strong> {weather.current.temperature} Celcius
      </p>
      <img
        src={weather.current.weather_icons[0]}
        alt={`${weather.location.name} weather icon`}
      />
      <p>
        <strong>wind:</strong> {`${weather.current.wind_speed} mph`} direction{' '}
        {weather.current.wind_dir}
      </p>
    </div>
  );
};

export default WeatherInfo;
