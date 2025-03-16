import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

// Define the expected response structure from Google Books API
interface GoogleAPIVolumeInfo {
  title: string;
  authors: string[];
  description: string;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
  infoLink?: string;  // Added infoLink as optional
}

interface GoogleAPIBook {
  id: string;
  volumeInfo: GoogleAPIVolumeInfo;
}

interface GoogleBooksResponse {
  items: GoogleAPIBook[];
}

interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface SaveBookArgs {
  book: {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
  };
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('Could not authenticate user.');
    },

    getUsers: async () => {
      return User.find().populate('savedBooks');
    },

    getUser: async (_parent: any, { username }: { username: string }) => {
      return User.findOne({ username }).populate('savedBooks');
    },

    // Query to fetch books from Google Books API
    getBooksFromGoogle: async (_parent: any, { searchInput }: { searchInput: string }) => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);
        if (!response.ok) {
          throw new Error('Failed to fetch books from Google Books API');
        }

        // Cast the response JSON to the GoogleBooksResponse type
        const data = (await response.json()) as GoogleBooksResponse;

        // Map the fetched data to match frontend requirements
        const books = data.items.map((book) => ({
          bookId: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors || ['No author to display'],
          description: book.volumeInfo.description,
          image: book.volumeInfo.imageLinks?.thumbnail || '',
          link: book.volumeInfo.infoLink || ''  // Safely accessing infoLink
        }));

        return books;
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching books from Google Books API');
      }
    },
  },

  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      try {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await User.create({
          ...input,
          password: hashedPassword,
        });

        const token = signToken(user.username, user.email, user._id.toString());
        return { token, user };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user.");
      }
    },

    login: async (_parent: any, { email, password }: LoginUserArgs, context: any) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      const token = signToken(user.username, user.email, user._id);
      context.user = user;
      return { token, user };
    },







    
// Updated saveBook mutation to check if a book is already saved for the current user
saveBook: async (_parent: any, { book }: SaveBookArgs, context: any) => {
  if (!context.user) {
    throw new AuthenticationError('You need to be logged in to save a book.');
  }

  const existingUser = await User.findById(context.user._id);
  if (existingUser) {
    // Check if the book already exists in savedBooks for this user
    const isBookAlreadySaved = existingUser.savedBooks.some(
      (savedBook) => savedBook.bookId === book.bookId
    );

    if (isBookAlreadySaved) {
      throw new Error('This book has already been saved.');
    }

    // If the book isn't already saved, add it to the user's savedBooks
    return User.findByIdAndUpdate(
      context.user._id,
      { $addToSet: { savedBooks: book } },  // Use $addToSet to avoid duplicates
      { new: true, runValidators: true }
    ).populate('savedBooks');
  }
  throw new Error('User not found.');
},








    // saveBook to accept and store full book details
    // saveBook: async (_parent: any, { book }: SaveBookArgs, context: any) => {
    //   if (!context.user) {
    //     throw new AuthenticationError('You need to be logged in to save a book.');
    //   }

    //   return User.findByIdAndUpdate(
    //     context.user._id,
    //     { $addToSet: { savedBooks: book } },  // storing full book object
    //     { new: true, runValidators: true }
    //   ).populate('savedBooks');
    // },

















    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to remove a book.');
      }

      return User.findByIdAndUpdate(
        context.user._id, 
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      ).populate('savedBooks');
    },
  },
};

export default resolvers;





