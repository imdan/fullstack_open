import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import { setAlert } from './reducers/alertReducer';
import {
  initializeBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} from './reducers/blogReducer';
import { setUser } from './reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import { initUsers } from './reducers/usersReducer';
import Users from './components/Users';
import User from './components/User';
import BlogDetail from './components/BlogDetail';
import Navbar from './components/Navbar';
import { Table, Alert, Form, Button } from 'react-bootstrap';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initUsers());
  }, [dispatch]);

  const alert = useSelector(state => state.alert);
  const blogs = useSelector(state => state.blogs);
  const loggedInUser = useSelector(state => state.user);
  const users = useSelector(state => state.users);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);

      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  }, [dispatch]);

  const blogFormRef = useRef();

  const userMatch = useRouteMatch('/users/:id');

  const user = userMatch
    ? users.find(user => user.id.toString() === userMatch.params.id.toString())
    : null;

  const blogMatch = useRouteMatch('/blogs/:id');
  const blog = blogMatch
    ? blogs.find(blog => blog.id.toString() === blogMatch.params.id.toString())
    : null;

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password
      });

      window.localStorage.setItem('loggedInUser', JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(setAlert('wrong username or password', false, 5));
    }
  };

  const handleLogout = e => {
    e.preventDefault();
    window.localStorage.clear();
    dispatch(setUser(null));
  };

  const createNewBlog = async newBlog => {
    blogFormRef.current.toggleVisibility();
    try {
      dispatch(createBlog(newBlog));

      dispatch(setAlert(`new blog ${newBlog.title} added!`, true, 5));
    } catch (exception) {
      console.log(exception);

      dispatch(setAlert('unable to add blog', false, 5));
    }
  };

  const likeBlog = async updatedBlog => {
    try {
      dispatch(updateBlog(updatedBlog));
    } catch (exception) {
      console.log(exception);
    }
  };

  const removeBlog = async blogId => {
    try {
      dispatch(deleteBlog(blogId));
    } catch (exception) {
      console.log(exception);
    }
  };

  if (loggedInUser === null) {
    // show login
    return (
      <div className='container'>
        <h2>log in to application</h2>

        {alert && (
          <Alert variant={alert.success ? 'success' : 'danger'} id='alert'>
            {alert.msg}
          </Alert>
        )}

        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username</Form.Label>
            <Form.Control
              type='text'
              value={username}
              id='username'
              name='username'
              onChange={({ target }) => setUsername(target.value)}
            />
            <Form.Label>password</Form.Label>
            <Form.Control
              type='password'
              value={password}
              id='password'
              name='password'
              onChange={({ target }) => setPassword(target.value)}
            />
            <Button
              variant='primary'
              className='mt-3'
              type='submit'
              id='loginButton'>
              login
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }

  return (
    <div className='container'>
      <Navbar loggedInUser={loggedInUser} handleLogout={handleLogout} />

      <h1>blog app</h1>

      {alert && (
        <Alert variant={alert.success ? 'success' : 'danger'} id='alert'>
          {alert.msg}
        </Alert>
      )}

      <Switch>
        <Route path='/users/:id'>
          <User user={user} />
        </Route>
        <Route path='/blogs/:id'>
          <BlogDetail blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />
        </Route>

        <Route path='/users'>
          <Users />
        </Route>
        <Route path='/'>
          <Togglable
            buttonLabel='create new blog'
            closeLabel='cancel'
            ref={blogFormRef}>
            <BlogForm createNewBlog={createNewBlog} />
          </Togglable>
          <Table striped>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </td>
                  <td>{blog.author}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <div id='blogList'>
            {blogs.map(blog => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div> */}
        </Route>
      </Switch>
    </div>
  );
};

export default App;
