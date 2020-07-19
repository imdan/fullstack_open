const _ = require('lodash');

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  // returns total number of likes for all blogs
  const likesArr = blogs.map(blog => blog.likes);
  const reducer = (total, current) => total + current;
  const likesTotal = likesArr.reduce(reducer);
  return likesTotal;
};

const favoriteBlog = blogs => {
  // returns blog with most likes
  const likesArr = blogs.map(blog => blog.likes);
  const maxLikes = likesArr.reduce((a, b) => {
    return Math.max(a, b);
  });
  const indexOfMax = likesArr.indexOf(maxLikes);

  const favorite = blogs[indexOfMax];
  const { title, author, likes } = favorite;

  return {
    title,
    author,
    likes
  };
};

const mostBlogs = blogs => {
  //   i think this should work...returns author with most blogs and count of blogs

  const authorsObj = _.countBy(blogs, 'author');
  const authorsArr = Object.keys(authorsObj);
  const valuesArr = Object.values(authorsObj);
  const maxVal = _.max(valuesArr);
  const maxValIndex = valuesArr.indexOf(maxVal);
  const maxAuthor = authorsArr[maxValIndex];

  //   console.log({ author: maxAuthor, blogs: maxKey });
  return { author: maxAuthor, blogs: maxVal };
};

const mostLikes = blogs => {
  // will return author with the most likes and the number of likes
  // took a long time to figure this out...then the file got resaved without this function somehow so i had to redo it from memory three days later and actually got it somehow in like ten minutes

  const trimmedBlogs = blogs.map(blog => {
    return {
      author: blog.author,
      likes: blog.likes
    };
  });

  const reducer = (acc, obj) => {
    const key = obj['author'];
    if (!acc[key]) {
      acc[key] = obj.likes;
    } else {
      acc[key] += obj.likes;
    }
    return acc;
  };

  const groupedBlogs = trimmedBlogs.reduce(reducer, {});
  const authors = Object.keys(groupedBlogs);
  const likes = Object.values(groupedBlogs);
  const maxLikes = _.max(likes);
  const indexOfMax = likes.indexOf(maxLikes);
  const maxAuthor = authors[indexOfMax];

  return {
    author: maxAuthor,
    likes: maxLikes
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
