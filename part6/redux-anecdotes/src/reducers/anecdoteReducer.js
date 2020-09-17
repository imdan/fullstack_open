// const getId = () => (100000 * Math.random()).toFixed(0);

// const asObject = anecdote => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   };
// };

import anecdoteService from '../services/anecdotes';

export const addVote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.addLike(anecdote);
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote
    });
  };
};

export const addAnecdote = data => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(data);
    dispatch({
      type: 'ADD_ANECDOTE',
      data: newAnecdote
    });
  };
};

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    });
  };
};

const reducer = (state = [], action) => {
  // console.log('state now: ', state);
  // console.log('action', action);
  switch (action.type) {
    case 'VOTE': {
      const changedItem = action.data;
      const newState = state.map(item =>
        item.id !== changedItem.id ? item : changedItem
      );
      newState.sort((a, b) => b.votes - a.votes);

      return newState;
    }
    case 'ADD_ANECDOTE': {
      const anecdote = action.data;
      // const anecdoteObj = asObject(anecdote);

      const newState = state.concat(anecdote);
      newState.sort((a, b) => b.votes - a.votes);

      return newState;
    }
    case 'INIT_ANECDOTES': {
      const initialState = action.data;
      initialState.sort((a, b) => b.votes - a.votes);

      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
