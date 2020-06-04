import React from 'react';

const Person = ({ person, handleClick }) => {
  return (
    <div>
      {person.name} {person.number}{' '}
      <button
        onClick={() => {
          if (window.confirm(`Delete ${person.name}?`)) {
            handleClick(person.id);
          }
        }}>
        delete
      </button>
    </div>
  );
};

const Persons = ({ persons, handleClick }) => {
  return (
    <div>
      {persons.map(person => (
        <Person person={person} key={person.name} handleClick={handleClick} />
      ))}
    </div>
  );
};

export default Persons;
