import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const BlogForm = ({ createNewBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');

  const addBlog = e => {
    e.preventDefault();

    createNewBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    });

    setNewBlogTitle('');
    setNewBlogAuthor('');
    setNewBlogUrl('');
  };

  return (
    <div>
      <h2>create new</h2>

      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            type='text'
            name='title'
            id='title'
            value={newBlogTitle}
            onChange={({ target }) => setNewBlogTitle(target.value)}
          />
          <Form.Label>author:</Form.Label>
          <Form.Control
            type='text'
            name='author'
            id='author'
            value={newBlogAuthor}
            onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
          <Form.Label>url:</Form.Label>
          <Form.Control
            type='text'
            name='url'
            id='url'
            value={newBlogUrl}
            onChange={({ target }) => setNewBlogUrl(target.value)}
          />

          <Button
            type='submit'
            variant='primary'
            className='mt-2'
            id='newBlogButton'>
            create
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default BlogForm;
