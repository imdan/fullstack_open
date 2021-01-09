import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, ME } from '../queries';

const Login = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    refetchQueries: [{ query: ME }],
    onError: error => {
      console.error(error.graphQLErrors[0].message);
    }
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      props.setToken(token);
      localStorage.setItem('library-user-token', token);
    }
  }, [result.data]); //eslint-disable-line

  if (!props.show) {
    return null;
  }

  const submit = async event => {
    event.preventDefault();

    console.log('login');
    login({ variables: { username, password } });
    props.setPage('authors');

    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default Login;
