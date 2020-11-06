import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Navbar = ({ loggedInUser, handleLogout }) => {
  const navStyle = {
    backgroundColor: '#d3d3d3',
    width: '100%',
    marginRight: '5px'
  };

  const itemStyle = {
    margin: '4px',
    display: 'inline-block'
  };
  return (
    <div style={navStyle}>
      <Link style={itemStyle} to='/'>
        blogs
      </Link>
      <Link style={itemStyle} to='/users'>
        users
      </Link>
      <div style={itemStyle}>{loggedInUser.name} logged in</div>
      <Button
        variant='light'
        type='button'
        size='sm'
        className='m-2'
        onClick={handleLogout}>
        logout
      </Button>
    </div>
  );
};

export default Navbar;
