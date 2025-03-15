import { gql } from '@apollo/client';


export const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;


export const GET_BOOKS_FROM_GOOGLE = gql`
  query getBooksFromGoogle($searchInput: String!) {
    getBooksFromGoogle(searchInput: $searchInput) {
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;
