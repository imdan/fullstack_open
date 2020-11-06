import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { commentOnBlog } from '../reducers/blogReducer';
import { Button, Form } from 'react-bootstrap';

const BlogDetail = ({ blog, likeBlog }) => {
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const addComment = () => {
    if (comment !== '') {
      dispatch(commentOnBlog(blog.id, { comment }));
      setComment('');
    }
  };

  const addLike = e => {
    e.preventDefault();
    const user = blog.user ? blog.user : '';
    likeBlog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: user.id,
      id: blog.id
    });
  };

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={`${blog.url}`}>{blog.url}</a>
      <br />
      {blog.likes} likes{' '}
      <Button variant='primary' size='sm' onClick={addLike}>
        like
      </Button>
      <br />
      added by {`${blog.user.username}`}
      <div>
        <h2>comments</h2>
        <Form>
          <Form.Group>
            <Form.Control
              as='textarea'
              ows={3}
              value={comment}
              onChange={({ target }) => setComment(target.value)}
            />
            <Button
              variant='primary'
              className='mt-3'
              onClick={addComment}
              onSubmit={addComment}>
              add comment
            </Button>
          </Form.Group>
        </Form>

        <ul>
          {blog.comments.map((comment, i) => (
            <li key={i}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogDetail;
