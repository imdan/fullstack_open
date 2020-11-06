let timeoutId;
export const setAlert = (msg, success, length) => {
  return async dispatch => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    dispatch({
      type: 'SET_ALERT',
      msg,
      success
    });

    timeoutId = setTimeout(() => {
      dispatch({
        type: 'REMOVE_ALERT'
      });
    }, length * 1000);
  };
};

const alertReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_ALERT':
      return action;
    case 'REMOVE_ALERT':
      return null;
    default:
      return state;
  }
};

export default alertReducer;
