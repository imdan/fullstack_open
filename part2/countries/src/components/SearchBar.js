import React from 'react';

const SearchBar = ({ search, handleChange }) => {
  return (
    <div>
      find countries <input value={search} onChange={handleChange} />
    </div>
  );
};

export default SearchBar;
