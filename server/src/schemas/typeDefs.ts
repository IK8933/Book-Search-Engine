import {gql} from "graphql-tag"

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    saveBooks: [Book]
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
    getBook(bookId: ID!): Book
  }

    input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(userId: ID!, bookId: ID!): User
    removeBook(userId: ID!, bookId: ID!): User
  }
`;

export default typeDefs;
