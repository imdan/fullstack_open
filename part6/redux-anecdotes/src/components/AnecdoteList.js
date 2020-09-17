import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { connect } from 'react-redux';

import { addVote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = props => {
  // const anecdotes = useSelector(state => {
  //   if (state.filter === '') {
  //     return state.anecdotes;
  //   } else {
  //     return state.anecdotes.filter(anecdote =>
  //       anecdote.content.includes(state.filter)
  //     );
  //   }
  // });
  // const dispatch = useDispatch();
  const anecdotes = props.anecdotes;

  const vote = anecdote => {
    // console.log('vote', anecdote.id);
    // dispatch(addVote(anecdote));
    // dispatch(setNotification(`voted for ${anecdote.content}`, 5));
    props.addVote(anecdote);
    props.setNotification(`voted for ${anecdote.content}`, 5);
  };

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

const mapStateToProps = state => {
  // console.log(state);
  if (state.filter === '') {
    return {
      anecdotes: state.anecdotes,
      filter: state.filter
    };
  } else {
    return {
      anecdotes: state.anecdotes.filter(anecdote =>
        anecdote.content.includes(state.filter)
      ),
      filter: state.filter
    };
  }
};

const mapDispatchToProps = {
  addVote,
  setNotification
};

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList);
export default ConnectedAnecdoteList;
