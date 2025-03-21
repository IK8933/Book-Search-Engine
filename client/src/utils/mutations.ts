import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            username
            email
        }
    }
}
`;

export const ADD_USER = gql`
mutation addUser($input: UserInput!) {  
    addUser(input: $input) {  
        token
        user {
            _id
            username
        } 
    }
}
`;
export const SAVE_BOOK = gql`
mutation saveBook($book: BookInput!) {  #  Change 'bookData' to 'book'
    saveBook(book: $book) {  
        _id
        username
        email
        savedBooks {
            bookId
            authors
            title
            description
            image
            link
        }
    }
}
`;

export const REMOVE_BOOK = gql`
mutation removeBook($bookId: String!) {  
    removeBook(bookId: $bookId) {
        _id
        username
        email
        savedBooks {
            bookId
            authors
            title
            description
            image
            link
        }
    }
}
`;

// export default {
//     LOGIN_USER,
//     ADD_USER,
//     SAVE_BOOK,
//     REMOVE_BOOK
// };