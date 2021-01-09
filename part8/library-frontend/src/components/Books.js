import React, { useState } from 'react';

const Books = props => {
  const [genre, setGenre] = useState('');

  if (!props.show) {
    return null;
  }

  if (props.books.loading) {
    return <div>loading...</div>;
  }

  const books = props.books.data.allBooks;

  const booksToShow = !genre
    ? books
    : books.filter(b => b.genres.includes(genre));

  return (
    <div>
      <h2>books</h2>

      <p>
        genre set to <strong>{genre ? genre : 'all'}</strong>
      </p>

      <button onClick={() => setGenre('refactoring')}>refactoring</button>
      <button onClick={() => setGenre('agile')}>agile</button>
      <button onClick={() => setGenre('patterns')}>patterns</button>
      <button onClick={() => setGenre('design')}>design</button>
      <button onClick={() => setGenre('crime')}>crime</button>
      <button onClick={() => setGenre('classic')}>classic</button>
      <button onClick={() => setGenre('')}>show all</button>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
