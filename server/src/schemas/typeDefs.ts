import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]  # Stores full book objects
    bookCount: Int
  }

  type Book {
    bookId: String!  
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    getUsers: [User]
    getUser(username: String!): User
    getBook(bookId: String!): Book
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  # BookInput to store full book details
  input BookInput {
    bookId: String!  
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    
    # saveBook to accept full book object
    saveBook(book: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;