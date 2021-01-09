import React, { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import Recommended from './components/Recommended';

import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription
} from '@apollo/client';

import {
  ALL_AUTHORS,
  ALL_BOOKS,
  CREATE_BOOK,
  EDIT_AUTHOR,
  BOOK_ADDED
} from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }]
  });

  const [updateAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  });

  // const loggedInUser = useQuery(ME);

  const updateCacheWith = addedBook => {
    const includedIn = (set, obj) => {
      set.map(b => b.id).includes(obj.id);
    };

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) }
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(`added ${addedBook.title}`);
      // console.log(subscriptionData);
      updateCacheWith(addedBook);
    }
  });

  useEffect(() => {
    if (localStorage.getItem('library-user-token')) {
      const userToken = localStorage.getItem('library-user-token');
      setToken(userToken);
    }
  }, []);

  const logout = () => {
    setPage('authors');
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors
        show={page === 'authors'}
        authors={authors}
        updateAuthor={updateAuthor}
        token={token}
      />

      <Books show={page === 'books'} books={books} />

      <Recommended show={page === 'recommended'} books={books} />

      <Login show={page === 'login'} setToken={setToken} setPage={setPage} />

      {token && (
        <NewBook
          show={page === 'add'}
          createBook={createBook}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default App;
