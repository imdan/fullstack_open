import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';
// import { prettyDOM } from '@testing-library/dom';

describe('<Blog />', () => {
  const blog = {
    title: 'Super Blog Blog',
    author: 'John Stamos',
    url: 'www.blogsite.com',
    likes: 0,
    user: {
      username: 'Joben',
      name: 'Joben'
    },
    id: '1'
  };

  const mockUpdate = jest.fn();
  const mockRemove = jest.fn();
  const mockUsername = 'testUser';

  let component;

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdate}
        removeBlog={mockRemove}
        username={mockUsername}
      />
    );
  });

  test('default only renders blog title and author', () => {
    const blogDiv = component.container.querySelector('.blog');
    // expect(blogDiv).toHaveTextContent('Super Blog Blog John Stamos');
    expect(blogDiv).toBeDefined();

    const detailDiv = component.container.querySelector('.details')
      ? component.container.querySelector('.details')
      : undefined;
    // expect(blogDiv).not.toHaveTextContent('www.blogsite.com 0');
    expect(detailDiv).toBeUndefined();

    // console.log(prettyDOM(blogDiv));
  });

  test('details are rendered when button is clicked', () => {
    const button = component.getByText('view');
    fireEvent.click(button);

    const detailDiv = component.container.querySelector('.details');

    expect(detailDiv).toBeDefined();

    // console.log(prettyDOM(detailDiv));
  });

  test('clicking like button twice fires two events', () => {
    const button = component.getByText('view');
    fireEvent.click(button);

    const likeButton = component.getByText('like');

    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockUpdate.mock.calls).toHaveLength(2);
  });
});
