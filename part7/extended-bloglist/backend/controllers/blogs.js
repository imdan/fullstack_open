const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;
  const blog = new Blog(body);

  const decodedToken = jwt.verify(request.token, config.SECRET);
  if (!decodedToken.id) {
    return response.status(400).json({ error: 'token invalid or missing' });
  }
  const user = await User.findById(decodedToken.id);

  if (!blog.likes) {
    blog.likes = 0;
  }

  if (!body.title && !body.url) {
    return response.status(400).end();
  }

  blog.user = user;

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouter.post('/:id/comments', async (request, response) => {
  const newComment = request.body.comment;

  const commentedBlog = await Blog.findById(request.params.id).populate(
    'user',
    { username: 1, name: 1 }
  );

  if (commentedBlog) {
    commentedBlog.comments = commentedBlog.comments.concat(newComment);
  }

  const blog = await commentedBlog.save();

  response.status(201).json(blog);
});

blogRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id);

  if (!blogToDelete) {
    return response.status(400).json({ error: 'blog does not exist' });
  }

  const decodedToken = jwt.verify(request.token, config.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid or missing' });
  }
  const user = await User.findById(decodedToken.id);

  if (blogToDelete.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
  } else {
    return response.status(401).json({ error: 'token invalid or missing' });
  }

  response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  }).populate('user', { username: 1, name: 1 });

  response.json(updatedBlog);
});

module.exports = blogRouter;
