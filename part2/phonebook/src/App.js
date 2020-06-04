import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNewName = event => setNewName(event.target.value);
  const handleNewNumber = event => setNewNumber(event.target.value);

  const addName = event => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber
    };

    const namesArr = persons.map(person => person.name);

    if (namesArr.includes(newName)) {
      // alert(`${newName} has already been added to phonebook!`);
      if (
        window.confirm(
          `${newName} has already been added, replace old number with a new one?`
        )
      ) {
        const changedPerson = persons.find(person => person.name === newName);
        const changedNumber = { ...changedPerson, number: nameObject.number };

        personService
          .update(changedPerson.id, changedNumber)
          .then(response => {
            setPersons(
              persons.map(person =>
                person.id !== changedPerson.id ? person : response
              )
            );
            setNotification({
              success: true,
              msg: `${changedNumber.name} has been updated`
            });
            setTimeout(() => setNotification(null), 4000);
            setNewName('');
            setNewNumber('');
          })
          .catch(err => {
            console.error(err);
            setNotification({
              success: false,
              msg: `Information for ${nameObject.name} has already been removed from the server`
            });
            setTimeout(() => setNotification(null), 4000);
          });
      }
    } else {
      personService.create(nameObject).then(response => {
        setPersons(persons.concat(response));
        setNotification({
          success: true,
          msg: `${nameObject.name} has been added`
        });
        setTimeout(() => setNotification(null), 4000);
        setNewName('');
        setNewNumber('');
      });
    }
  };

  const deleteName = id => {
    personService.destroy(id).then(() => {
      setPersons(persons.filter(person => person.id !== id));
    });
  };

  const handleFilter = event => {
    if (event.target.value === '') {
      setFilter('');
      setShowAll(true);
    } else {
      setFilter(event.target.value);
      setShowAll(false);
    }
  };

  const personsToShow = showAll
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification value={notification} />
      <Filter value={filter} handleChange={handleFilter} />

      <h3>add new number</h3>
      <PersonForm
        handleSubmit={addName}
        nameValue={newName}
        handleNameChange={handleNewName}
        numberValue={newNumber}
        handleNumberChange={handleNewNumber}
      />

      <h3>numbers</h3>
      <Persons persons={personsToShow} handleClick={deleteName} />
    </div>
  );
};

export default App;
