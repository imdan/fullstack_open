const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.msg;
    case 'REMOVE_NOTIFICATION':
      return null;
    default:
      return state;
  }
};

let timeoutId;
export const setNotification = (msg, length) => {
  return async dispatch => {
    // console.log(`first ${timeoutId}`);
    if (timeoutId) {
      clearTimeout(timeoutId);
      // console.log(`cleared timeout ${timeoutId}`);
    }

    dispatch({
      type: 'SET_NOTIFICATION',
      msg
    });

    timeoutId = setTimeout(() => {
      dispatch({
        type: 'REMOVE_NOTIFICATION'
      });
    }, length * 1000);

    // console.log(`second ${timeoutId}`);
  };
};

export default notificationReducer;
