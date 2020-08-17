describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'Bird Person',
      name: 'Bird Person',
      password: 'testPassword'
    });
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function() {
    cy.contains('log in to application');
    cy.get('#username');
    cy.get('#password');
    cy.get('#loginButton');
  });

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Bird Person');
      cy.get('#password').type('testPassword');
      cy.get('#loginButton').click();

      cy.contains('Bird Person logged in');
    });

    it('fails with invalid credentials', function() {
      cy.get('#username').type('Wrong Person');
      cy.get('#password').type('wrongPassword');
      cy.get('#loginButton').click();

      cy.get('#alert')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid');

      cy.get('html').should('not.contain', 'Bird Person logged in');
    });
  });

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'Bird Person',
        password: 'testPassword'
      }).then(response => {
        localStorage.setItem('loggedInUser', JSON.stringify(response.body));
        cy.visit('http://localhost:3000');
      });
    });

    it('a new blog can be added', function() {
      cy.contains('create new blog').click();
      cy.get('#title').type('Test Blog');
      cy.get('#author').type('Test Man');
      cy.get('#url').type('www.website.com');
      cy.get('#newBlogButton').click();
      cy.get('#alert')
        .should('contain', 'new blog Test Blog added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid');
      cy.get('#blogList').should('contain', 'Test Blog');
    });

    it('a user can like a blog', function() {
      cy.contains('create new blog').click();
      cy.get('#title').type('Test Blog');
      cy.get('#author').type('Test Man');
      cy.get('#url').type('www.website.com');
      cy.get('#newBlogButton').click();
      cy.get('#detailButton').click();
      cy.get('#likeButton').click();
      cy.get('#likes').should('contain', '1');
    });

    it('a user can delete their blog', function() {
      cy.contains('create new blog').click();
      cy.get('#title').type('Test Blog');
      cy.get('#author').type('Test Man');
      cy.get('#url').type('www.website.com');
      cy.get('#newBlogButton').click();
      cy.get('#detailButton').click();
      cy.get('#removeButton').click();
      cy.get('#blogList').should('not.contain', 'Test Blog');
    });

    it('blogs are ordered according to likes', function() {
      cy.contains('create new blog').click();
      cy.get('#title').type('Test Blog 1');
      cy.get('#author').type('Test Man');
      cy.get('#url').type('www.website.com');
      cy.get('#newBlogButton').click();
      cy.get('#detailButton').click();
      //   cy.get('#likeButton').click();
      //   cy.get('#likeButton').click();

      cy.contains('create new blog').click();
      cy.get('#title').type('Test Blog 2');
      cy.get('#author').type('Test Man');
      cy.get('#url').type('www.test.com');
      cy.get('#newBlogButton').click();
      cy.contains('Test Blog 2 Test Man')
        .find('#detailButton')
        .click();
      cy.contains('Test Blog 2 Test Man')
        .parent()
        .find('#likeButton')
        .click();
      cy.contains('Test Blog 2 Test Man')
        .parent()
        .find('#likeButton')
        .click();

      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[0]).should('contain', 'Test Blog 2');
        cy.wrap(blogs[1]).should('contain', 'Test Blog 1');
      });
    });
  });
});
