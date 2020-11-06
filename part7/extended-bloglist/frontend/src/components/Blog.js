import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {
  // const remove = () => {
  //   if (window.confirm(`Remove ${blog.title}?`)) {
  //     removeBlog(blog.id);
  //   }
  // };

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
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}{' '}
        </Link>
      </div>
    </div>
  );
};

// Blog.propTypes = {
//   blog: PropTypes.object.isRequired,
//   likeBlog: PropTypes.func.isRequired,
//   removeBlog: PropTypes.func.isRequired,
//   username: PropTypes.string.isRequired
// };

export default Blog;
