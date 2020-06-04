import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import SearchItem from './components/SearchItem';
import CountryInfo from './components/CountryInfo';

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then(response => {
      setCountries(response.data);
    });
  }, []);

  const countryNames = countries.map(country => country.name);
  const searchResults = !search
    ? []
    : countryNames.filter(country =>
        country.toLowerCase().includes(search.toLowerCase())
      );

  const handleSearch = event => {
    const searchStr = event.target.value;
    setSearch(searchStr);
  };

  const handleClick = name => {
    setSearch(name);
  };

  if (searchResults.length > 10) {
    return (
      <div>
        <SearchBar search={search} handleChange={handleSearch} />
        <p>Too many matches, be more specific</p>
      </div>
    );
  }

  if (searchResults.length <= 10 && searchResults.length > 1) {
    return (
      <div>
        <SearchBar search={search} handleChange={handleSearch} />
        {searchResults.map(result => (
          <SearchItem
            countryName={result}
            key={result}
            handleClick={handleClick}
          />
        ))}
      </div>
    );
  }

  if (searchResults.length === 1) {
    return (
      <div>
        <SearchBar search={search} handleChange={handleSearch} />
        <CountryInfo
          country={countries.filter(country =>
            country.name.includes(searchResults)
          )}
        />
      </div>
    );
  }

  return (
    <div>
      <SearchBar search={search} handleChange={handleSearch} />
    </div>
  );
}

export default App;
