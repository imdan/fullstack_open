import React, { useState } from 'react';

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

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type='text'
            name='title'
            id='title'
            value={newBlogTitle}
            onChange={({ target }) => setNewBlogTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            name='author'
            id='author'
            value={newBlogAuthor}
            onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            name='url'
            id='url'
            value={newBlogUrl}
            onChange={({ target }) => setNewBlogUrl(target.value)}
          />
        </div>

        <button type='submit' id='newBlogButton'>
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
