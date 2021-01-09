import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ME, ALL_BOOKS } from '../queries';

const Recommended = props => {
  const [getBooks, result] = useLazyQuery(ALL_BOOKS, {
    pollInterval: 5000
  });
  // const [update, setUpdate] = useState(false);
  const user = useQuery(ME, {
    pollInterval: 1000
  });
  const [filteredBooks, setFilteredBooks] = useState(null);

  const makeQueries = () => {
    getBooks({ variables: { genre: user.data.me.favoriteGenre } });
    user.stopPolling();
  };

  //  idk need to figure out how to update the reco view when a book is added

  // useEffect(() => {
  //   setUpdate(true);
  // }, [props.books]);

  useEffect(() => {
    if (result.data) {
      setFilteredBooks(result.data.allBooks);
    }
  }, [result]);

  if (!props.show) {
    return null;
  }

  if (props.books.loading) {
    return <div>loading...</div>;
  }

  if (filteredBooks) {
    return (
      <div>
        <h2>recommended books</h2>

        <p>
          books in {user.data.me.username}'s favorite genre{' '}
          <strong>{user.data.me.favoriteGenre}</strong>
        </p>

        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filteredBooks.map(a => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* {update && (
          <button onClick={makeQueries}>update recommendations</button>
        )} */}
      </div>
    );
  }

  return (
    <div>
      <h2>recommended books</h2>

      <button onClick={makeQueries}>get recommendations</button>
    </div>
  );
};

export default Recommended;
