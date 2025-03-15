import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// ✅ Define the expected data structure
interface UserData {
  me: {
    _id: string;
    username: string;
    email: string;
    savedBooks: {
      bookId: string;
      title: string;
      authors: string[];
      description: string;
      image?: string;
      link?: string;
    }[];
  };
}

const SavedBooks = () => {
  // ✅ Check if user is logged in
  const isLoggedIn = Auth.loggedIn();

  // ✅ Fetch user data using GraphQL Query
  const { loading, data } = useQuery<UserData>(GET_ME, {
    skip: !isLoggedIn, // ✅ Skip query if user is not logged in
  });
  
  const [removeBook] = useMutation(REMOVE_BOOK);
  const userData = data?.me || { username: '', savedBooks: [] };

  // ✅ Delete Book (Ensure user is logged in before calling mutation)
  const handleDeleteBook = async (bookId: string) => {
    if (!isLoggedIn) {
      console.log("❌ User is not logged in.");
      return;
    }

    try {
      await removeBook({
        variables: { bookId },
        update: (cache, { data }) => {
          if (!data?.removeBook) return;

          const existingUser = cache.readQuery<UserData>({ query: GET_ME });

          if (existingUser?.me) {
            cache.writeQuery({
              query: GET_ME,
              data: {
                me: {
                  ...existingUser.me,
                  savedBooks: data.removeBook.savedBooks,
                },
              },
            });
          }
        },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return <h2 className="text-center text-danger">❌ Please log in to view your saved books.</h2>;
  }

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing {userData.username}'s saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => (
            <Col key={book.bookId} md='4'>
              <Card border='dark'>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors?.join(', ') || 'Unknown Author'}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;











// import { Container, Card, Button, Row, Col } from 'react-bootstrap';
// import { useQuery, useMutation } from '@apollo/client'; // ✅ Import Apollo Client Hooks
// import { GET_ME } from '../utils/queries'; // ✅ Import GraphQL Query
// import { REMOVE_BOOK } from '../utils/mutations'; // ✅ Import GraphQL Mutation
// import Auth from '../utils/auth';
// import { removeBookId } from '../utils/localStorage';

// const SavedBooks = () => {
//   // ✅ Fetch user data using GraphQL Query instead of REST API
//   const { loading, data } = useQuery(GET_ME);
//   const [removeBook] = useMutation(REMOVE_BOOK);

//   const userData = data?.me || { savedBooks: [] };

//   // ✅ Delete Book using GraphQL Mutation instead of REST API
//   const handleDeleteBook = async (bookId: string) => {
//     try {
//       await removeBook({
//         variables: { bookId },
//         update: (cache, { data }) => {
//           const existingUser = cache.readQuery({ query: GET_ME });

//           if (existingUser && data?.removeBook) {
//             cache.writeQuery({
//               query: GET_ME,
//               data: {
//                 me: {
//                   ...existingUser.me,
//                   savedBooks: data.removeBook.savedBooks,
//                 },
//               },
//             });
//           }
//         },
//       });

//       removeBookId(bookId); // ✅ Remove book from localStorage
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return <h2>LOADING...</h2>;
//   }

//   return (
//     <>
//       <div className='text-light bg-dark p-5'>
//         <Container>
//           {userData.username ? (
//             <h1>Viewing {userData.username}'s saved books!</h1>
//           ) : (
//             <h1>Viewing saved books!</h1>
//           )}
//         </Container>
//       </div>
//       <Container>
//         <h2 className='pt-5'>
//           {userData.savedBooks.length
//             ? `Viewing ${userData.savedBooks.length} saved ${
//                 userData.savedBooks.length === 1 ? 'book' : 'books'
//               }`
//             : 'You have no saved books!'}
//         </h2>
//         <Row>
//           {userData.savedBooks.map((book) => (
//             <Col key={book.bookId} md='4'>
//               <Card border='dark'>
//                 {book.image ? (
//                   <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
//                 ) : null}
//                 <Card.Body>
//                   <Card.Title>{book.title}</Card.Title>
//                   <p className='small'>Authors: {book.authors.join(', ')}</p>
//                   <Card.Text>{book.description}</Card.Text>
//                   <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
//                     Delete this Book!
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default SavedBooks;
























// // import { useState, useEffect } from 'react';
// // import { Container, Card, Button, Row, Col } from 'react-bootstrap';

// // import { getMe, deleteBook } from '../utils/API';
// // import Auth from '../utils/auth';
// // import { removeBookId } from '../utils/localStorage';
// // import type { User } from '../models/User';

// // const SavedBooks = () => {
// //   const [userData, setUserData] = useState<User>({
// //     username: '',
// //     email: '',
// //     password: '',
// //     savedBooks: [],
// //   });

// //   // use this to determine if `useEffect()` hook needs to run again
// //   const userDataLength = Object.keys(userData).length;

// //   useEffect(() => {
// //     const getUserData = async () => {
// //       try {
// //         const token = Auth.loggedIn() ? Auth.getToken() : null;

// //         if (!token) {
// //           return false;
// //         }

// //         const response = await getMe(token);

// //         if (!response.ok) {
// //           throw new Error('something went wrong!');
// //         }

// //         const user = await response.json();
// //         setUserData(user);
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };

// //     getUserData();
// //   }, [userDataLength]);

// //   // create function that accepts the book's mongo _id value as param and deletes the book from the database
// //   const handleDeleteBook = async (bookId: string) => {
// //     const token = Auth.loggedIn() ? Auth.getToken() : null;

// //     if (!token) {
// //       return false;
// //     }

// //     try {
// //       const response = await deleteBook(bookId, token);

// //       if (!response.ok) {
// //         throw new Error('something went wrong!');
// //       }

// //       const updatedUser = await response.json();
// //       setUserData(updatedUser);
// //       // upon success, remove book's id from localStorage
// //       removeBookId(bookId);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   // if data isn't here yet, say so
// //   if (!userDataLength) {
// //     return <h2>LOADING...</h2>;
// //   }

// //   return (
// //     <>
// //       <div className='text-light bg-dark p-5'>
// //         <Container>
// //           {userData.username ? (
// //             <h1>Viewing {userData.username}'s saved books!</h1>
// //           ) : (
// //             <h1>Viewing saved books!</h1>
// //           )}
// //         </Container>
// //       </div>
// //       <Container>
// //         <h2 className='pt-5'>
// //           {userData.savedBooks.length
// //             ? `Viewing ${userData.savedBooks.length} saved ${
// //                 userData.savedBooks.length === 1 ? 'book' : 'books'
// //               }:`
// //             : 'You have no saved books!'}
// //         </h2>
// //         <Row>
// //           {userData.savedBooks.map((book) => {
// //             return (
// //               <Col md='4'>
// //                 <Card key={book.bookId} border='dark'>
// //                   {book.image ? (
// //                     <Card.Img
// //                       src={book.image}
// //                       alt={`The cover for ${book.title}`}
// //                       variant='top'
// //                     />
// //                   ) : null}
// //                   <Card.Body>
// //                     <Card.Title>{book.title}</Card.Title>
// //                     <p className='small'>Authors: {book.authors}</p>
// //                     <Card.Text>{book.description}</Card.Text>
// //                     <Button
// //                       className='btn-block btn-danger'
// //                       onClick={() => handleDeleteBook(book.bookId)}
// //                     >
// //                       Delete this Book!
// //                     </Button>
// //                   </Card.Body>
// //                 </Card>
// //               </Col>
// //             );
// //           })}
// //         </Row>
// //       </Container>
// //     </>
// //   );
// // };

// // export default SavedBooks;
