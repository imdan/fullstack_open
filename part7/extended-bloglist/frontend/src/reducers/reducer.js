export const doSomething = something => {
  return {
    type: 'DO_SOMETHING',
    something
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'DO_SOMETHING':
      return action.something;
    default:
      return state;
  }
};

export default reducer;
