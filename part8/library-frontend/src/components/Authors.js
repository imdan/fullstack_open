import React, { useState } from 'react';
import Select from 'react-select';

const Authors = props => {
  // const [name, setName] = useState('');
  const [born, setBorn] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  if (!props.show) {
    return null;
  }

  if (props.authors.loading) {
    return <div>loading...</div>;
  }

  const updateAuthor = async e => {
    e.preventDefault();

    const name = selectedOption.value;

    props.updateAuthor({ variables: { name, born } });
    // console.log(`${name} ${born}`);

    // setName('');
    setSelectedOption(null);
    setBorn('');
  };

  const authors = props.authors.data.allAuthors;

  const options = authors.map(a => {
    return { value: a.name, label: a.name };
  });

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.token && (
        <>
          <h3>set birthyear</h3>
          <form onSubmit={updateAuthor}>
            {/* name{' '}
        <input
        type='text'
        value={name}
        onChange={({ target }) => setName(target.value)}
      /> */}
            <Select
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
            />
            born{' '}
            <input
              type='text'
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
            <br />
            <button type='submit'>update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
