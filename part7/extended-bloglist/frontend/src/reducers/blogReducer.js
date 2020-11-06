import blogService from '../services/blogs';

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();

    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    });
  };
};

export const createBlog = data => {
  return async dispatch => {
    const newBlog = await blogService.create(data);
    dispatch({
      type: 'CREATE_BLOG',
      data: newBlog
    });
  };
};

export const deleteBlog = data => {
  return async dispatch => {
    await blogService.remove(data);
    const blogId = data;
    dispatch({
      type: 'DELETE_BLOG',
      data: blogId
    });
  };
};

export const updateBlog = data => {
  return async dispatch => {
    const updatedBlog = await blogService.update(data);
    dispatch({
      type: 'UPDATE_BLOG',
      data: updatedBlog
    });
  };
};

export const commentOnBlog = (id, comment) => {
  return async dispatch => {
    const commentedBlog = await blogService.commentOnBlog(id, comment);

    dispatch({
      type: 'COMMENT_BLOG',
      data: commentedBlog
    });
  };
};

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS': {
      const initialBlogs = action.data;
      initialBlogs.sort((a, b) => {
        return b.likes - a.likes;
      });

      return initialBlogs;
    }
    case 'CREATE_BLOG': {
      const newBlog = action.data;

      const newState = state.concat(newBlog);

      newState.sort((a, b) => {
        return b.likes - a.likes;
      });

      return newState;
    }
    case 'UPDATE_BLOG': {
      const updatedBlog = action.data;

      const blogs = state;
      const filteredBlogs = blogs.filter(blog => blog.id !== updatedBlog.id);
      const newState = filteredBlogs.concat(updatedBlog);
      newState.sort((a, b) => {
        return b.likes - a.likes;
      });

      return newState;
    }
    case 'COMMENT_BLOG': {
      const commentedBlog = action.data;

      const blogs = state;

      const filteredBlogs = blogs.filter(blog => blog.id !== commentedBlog.id);

      const newState = filteredBlogs.concat(commentedBlog);
      newState.sort((a, b) => {
        return b.likes - a.likes;
      });

      return newState;
    }
    case 'DELETE_BLOG': {
      const blogId = action.data;

      const blogs = state;
      const newState = blogs.filter(blog => blog.id !== blogId);
      newState.sort((a, b) => {
        return b.likes - a.likes;
      });

      return newState;
    }
    default: {
      return state;
    }
  }
};

export default blogReducer;
