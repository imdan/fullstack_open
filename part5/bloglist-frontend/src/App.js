import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({});

  useEffect(() => {
    const getData = async () => {
      const blogResponse = await blogService.getAll();
      blogResponse.sort((a, b) => {
        return b.likes - a.likes;
      });
      setBlogs(blogResponse);
    };

    getData();
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);

      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const blogFormRef = useRef();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password
      });

      window.localStorage.setItem('loggedInUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setAlert({
        success: false,
        msg: 'wrong username or password'
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlert({});
      }, 5000);
    }
  };

  const handleLogout = e => {
    e.preventDefault();
    window.localStorage.clear();
    setUser(null);
  };

  const createNewBlog = async newBlog => {
    blogFormRef.current.toggleVisibility();
    try {
      const response = await blogService.create(newBlog);
      setBlogs(blogs.concat(response));

      setAlert({
        success: true,
        msg: `new blog ${newBlog.title} added`
      });
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        setAlert({});
      }, 5000);
    } catch (exception) {
      console.log(exception);
      setAlert({
        success: false,
        msg: 'unable to add blog'
      });
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        setAlert({});
      }, 5000);
    }
  };

  const updateBlog = async updatedBlog => {
    try {
      const response = await blogService.update(updatedBlog);

      // console.log(response);
      const filteredBlogs = blogs.filter(blog => blog.id !== response.id);
      const blogList = filteredBlogs.concat(response);
      blogList.sort((a, b) => {
        return b.likes - a.likes;
      });
      setBlogs(blogList);
    } catch (exception) {
      console.log(exception);
    }
  };

  const removeBlog = async blogId => {
    try {
      await blogService.remove(blogId);

      const filteredBlogs = blogs.filter(blog => blog.id !== blogId);
      filteredBlogs.sort((a, b) => {
        return b.likes - a.likes;
      });
      setBlogs(filteredBlogs);
    } catch (exception) {
      console.log(exception);
    }
  };

  const successAlert = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    color: 'green'
  };

  const errAlert = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    color: 'red'
  };

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        {showAlert && (
          <div style={alert.success ? successAlert : errAlert} id='alert'>
            {alert.msg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              id='username'
              name='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='text'
              value={password}
              id='password'
              name='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit' id='loginButton'>
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>

      {showAlert && (
        <div style={alert.success ? successAlert : errAlert} id='alert'>
          {alert.msg}
        </div>
      )}

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable
        buttonLabel='create new blog'
        closeLabel='cancel'
        ref={blogFormRef}>
        <BlogForm createNewBlog={createNewBlog} />
      </Togglable>

      <div id='blogList'>
        {blogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            username={user.username}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
