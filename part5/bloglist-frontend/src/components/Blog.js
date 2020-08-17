import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateBlog, removeBlog, username }) => {
  const [showDetail, setShowDetail] = useState(false);

  const addLike = e => {
    e.preventDefault();
    const user = blog.user ? blog.user : '';
    updateBlog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: user.id,
      id: blog.id
    });
  };

  const remove = () => {
    if (window.confirm(`Remove ${blog.title}?`)) {
      removeBlog(blog.id);
    }
  };

  const user = blog.user ? blog.user : '';

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setShowDetail(!showDetail)} id='detailButton'>
          {!showDetail ? 'view' : 'hide'}
        </button>
      </div>

      {showDetail && (
        <div className='details'>
          <div>{blog.url}</div>
          <div id='likes'>
            {blog.likes}{' '}
            <button onClick={addLike} id='likeButton'>
              like
            </button>
          </div>
          <div>{user.name}</div>
          {user.username === username && (
            <button onClick={remove} id='removeButton'>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default Blog;
