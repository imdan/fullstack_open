import React from 'react';

const SearchItem = ({ countryName, handleClick }) => {
  return (
    <div>
      {countryName}{' '}
      <button
        onClick={() => {
          handleClick(countryName);
        }}>
        show
      </button>
    </div>
  );
};

export default SearchItem;
