const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.blogs.map(blog => new Blog(blog));
  const promiseArr = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArr);

  await api
    .post('/api/users')
    .send({ username: 'Test Guy', name: 'Test', password: 'testpassword' });
});

describe('testing routes and db', () => {
  test('all blogs returned in json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.blogs.length);
  });

  test('id property of blog is defined', async () => {
    const response = await api.get('/api/blogs');
    const firstBlog = response.body[0];
    // console.log(firstBlog);

    expect(firstBlog.id).toBeDefined();
  });

  test('post request is successful', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Bird Person',
      url: 'http://blog.birdperson.com/memoirs-of-a-bird-person',
      likes: 137
    };

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'Test Guy', password: 'testpassword' });

    const token = loginResponse.body.token;

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const authors = response.body.map(blog => blog.author);
    // console.log(authors);

    expect(response.body).toHaveLength(helper.blogs.length + 1);

    expect(authors).toContain('Bird Person');
  });

  test('likes property defaults to zero', async () => {
    const missingLikes = {
      title: 'Missing Likes',
      author: 'Bird Person',
      url: 'http://blog.birdperson.com/memoirs-of-a-bird-person'
    };

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'Test Guy', password: 'testpassword' });

    const token = loginResponse.body.token;

    await api
      .post('/api/blogs')
      .send(missingLikes)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const body = response.body;
    const blogWithoutLikes = body.filter(
      blog => blog.title === 'Missing Likes'
    );
    const blogObj = blogWithoutLikes[0];

    // console.log(blogObj);

    expect(blogObj.likes).toBe(0);
  });
});

test('missing title and url respond with 400 Bad Request', async () => {
  const missingTitleAndUrl = {
    author: 'Bird Person',
    likes: 0
  };

  await api
    .post('/api/blogs')
    .send(missingTitleAndUrl)
    .expect(400);
});

test('delete blog using id works correctly', async () => {
  // const response = await api.get('/api/blogs');
  // const blogToDelete = response.body[0];

  const newBlog = {
    title: 'Test Blog',
    author: 'Bird Person',
    url: 'http://blog.birdperson.com/memoirs-of-a-bird-person',
    likes: 137
  };

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'Test Guy', password: 'testpassword' });

  const token = loginResponse.body.token;

  const newBlogResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${token}`);

  const blogToDelete = newBlogResponse.body;

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204);

  const blogsInDb = await helper.blogsInDb();

  expect(blogsInDb).toHaveLength(helper.blogs.length);
});

test('put request successfully updates blog', async () => {
  const blogsInDb = await helper.blogsInDb();
  const blogToUpdate = blogsInDb[0];
  // console.log(blogToUpdate.likes);
  blogToUpdate.likes = blogToUpdate.likes + 1;
  // console.log(blogToUpdate.likes);

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlog = blogsAtEnd[0];

  expect(updatedBlog.likes).toBe(blogToUpdate.likes);
});

test('adding blog without token returns 401', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Bird Person',
    url: 'http://blog.birdperson.com/memoirs-of-a-bird-person',
    likes: 137
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401);
});

afterAll(() => {
  mongoose.connection.close();
});
