import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import bcrypt from 'bcrypt';

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

// Updated SaveBookArgs to accept a full book object
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

    // saveBook to accept and store full book details
    saveBook: async (_parent: any, { book }: SaveBookArgs, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to save a book.');
      }

      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: book } },  // storing full book object
        { new: true, runValidators: true }
      ).populate('savedBooks');
    },

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
