import React from 'react';

const Notification = ({ value }) => {
  if (value === null) {
    return <div></div>;
  }

  const { success, msg } = value;

  if (success === true) {
    return <div className='msg success'>{msg}</div>;
  }

  return <div className='msg err'>{msg}</div>;
};

export default Notification;
