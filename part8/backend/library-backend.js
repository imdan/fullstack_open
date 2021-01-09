const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError
} = require('apollo-server');
const { v1: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Book = require('./models/Book');
const Author = require('./models/Author');
const User = require('./models/User');

const JWT_SECRET = 'I_LIKE_TURTLES';

// replace username and password

const MONGODB_URI =
  'mongodb+srv://dan:PASSWORD@sup.3z6hf.gcp.mongodb.net/library?retryWrites=true&w=majority';

console.log('connecting to mongodb...');

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch(error => {
    console.error('error connecting to mongodb: ', error.message);
  });

const typeDefs = gql`
  type Author {
    name: String!
    born: String
    id: ID!
    bookCount: Int
  }

  type Book {
    title: String!
    published: String!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: String!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const { PubSub } = require('apollo-server');
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // if (args.author) {
      //   return books.filter(book => book.author === args.author);
      // }

      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author');
      }

      // if (args.author && args.genre) {
      //   return books.filter(
      //     book => book.author === args.author && book.genre.includes(args.genre)
      //   );
      // }

      const books = await Book.find({}).populate('author');

      return books;
    },
    allAuthors: () => {
      const authors = Author.find({}).populate('books');

      return authors;
    },
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Author: {
    bookCount: root => {
      // const allBooks = await Book.find({}).populate('author');
      // const booksByAuthor = allBooks.filter(b => b.author.name === root.name);

      const count = root.books.length;
      return count;
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const existingAuthor = await Author.findOne({
        name: args.author
      });

      const author = existingAuthor
        ? existingAuthor
        : await new Author({ name: args.author });

      const book = await new Book({
        ...args,
        author
      });

      author.books = author.books.concat(book._id);

      try {
        await author.save();
        await book.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args
        });
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (err) {
        throw new USerInputError(err.message, {
          invalidArgs: args
        });
      }

      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      });

      try {
        await user.save();
        return user;
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secred') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);

      const currentUser = await User.findById(decodedToken.id);

      return { currentUser };
    }
  }
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
