import React from 'react';
// import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { addAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = props => {
  // const dispatch = useDispatch();

  const createAnecdote = async event => {
    event.preventDefault();
    const anecdote = event.target.anecdote.value;
    event.target.anecdote.value = '';
    // dispatch(addAnecdote(anecdote));
    // dispatch(setNotification(`added ${anecdote}`, 5));
    props.addAnecdote(anecdote);
    props.setNotification(`added ${anecdote}`, 5);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  );
};

const mapDispatchToProps = {
  addAnecdote,
  setNotification
};

const ConnectedAnecdoteForm = connect(
  null,
  mapDispatchToProps
)(AnecdoteForm);
export default ConnectedAnecdoteForm;
