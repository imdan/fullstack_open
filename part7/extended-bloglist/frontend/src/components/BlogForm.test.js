import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';
// import { prettyDOM } from '@testing-library/dom';

describe('<BlogForm />', () => {
  test('BlogForm submits with correct details', () => {
    const createBlog = jest.fn();

    const component = render(<BlogForm createNewBlog={createBlog} />);

    const title = component.container.querySelector('#title');
    const author = component.container.querySelector('#author');
    const url = component.container.querySelector('#url');
    const form = component.container.querySelector('form');

    fireEvent.change(title, {
      target: { value: 'Test Blog' }
    });
    fireEvent.change(author, {
      target: { value: 'Bird Person' }
    });

    fireEvent.change(url, {
      target: { value: 'www.website.com' }
    });

    fireEvent.submit(form);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe('Test Blog');
    expect(createBlog.mock.calls[0][0].author).toBe('Bird Person');
    expect(createBlog.mock.calls[0][0].url).toBe('www.website.com');
  });
});
