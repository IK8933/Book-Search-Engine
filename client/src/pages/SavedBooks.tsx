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
      console.log(" User is not logged in.");
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
    return <h2 className="text-center text-danger"> Please log in to view your saved books.</h2>;
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
