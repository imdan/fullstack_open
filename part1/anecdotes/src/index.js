import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const Anecdote = ({ anecdote, voteCount }) => {
  if (voteCount === undefined) {
    return (
      <>
        <p>No votes yet</p>
      </>
    );
  }

  return (
    <>
      <p>{anecdote}</p>
      <p>Has {voteCount} votes</p>
    </>
  );
};

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });

  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const randomAnecdote = () => {
    const randomNum = getRandomInt(anecdotes.length);
    setSelected(randomNum);
  };

  // anecdotes[2] has definitely been the case here...exercise 1.14 took a little while

  const getLargest = () => {
    let votesCopy = { ...votes };
    let votesValues = Object.values(votesCopy);
    let largestCount = Math.max(...votesValues);

    if (largestCount === 0) {
      return null;
    } else {
      let mostVotes = votesValues.indexOf(largestCount);
      return mostVotes;
    }
  };

  let largest = getLargest();
  // console.log(votes[largest]);

  const addVote = () => {
    const votesCopy = { ...votes };
    votesCopy[selected] += 1;
    setVotes(votesCopy);
  };

  // console.log(anecdotes.length);

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected]} voteCount={votes[selected]} />

      <Button text='vote' handleClick={addVote} />
      <Button text='next anecdote' handleClick={randomAnecdote} />

      <h1>Anecdote with the most votes</h1>
      <Anecdote anecdote={anecdotes[largest]} voteCount={votes[largest]} />
    </div>
  );
};

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'));
