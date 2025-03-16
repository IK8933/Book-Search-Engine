import { useState, useEffect } from 'react';
import { FormEvent } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation, useLazyQuery } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { GET_BOOKS_FROM_GOOGLE } from '../utils/queries';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

interface GoogleBook {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image?: string;
  link?: string;
  __typename?: string; 
}

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState<GoogleBook[]>([]);
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // Use Apollo's useLazyQuery for searching books on button click
  const [getBooksFromGoogle, { loading, error }] = useLazyQuery(GET_BOOKS_FROM_GOOGLE);
  const [saveBook] = useMutation(SAVE_BOOK);

  // Store saved book IDs locally
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!searchInput) return;
  
    try {
      const { data, error } = await getBooksFromGoogle({
        variables: { searchInput },
      });
  
      if (error) {
        console.error("❌ GraphQL Error:", error);
      }
  
      console.log("🚀 API Response:", data);
  
      if (!data || !data.getBooksFromGoogle) {
        console.error("❌ No books found or unexpected response format.");
        setSearchedBooks([]); // Prevent crashes by setting an empty array
        return;
      }
  
      setSearchedBooks(data.getBooksFromGoogle);
      setSearchInput('');
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setSearchedBooks([]); // Prevent rendering issues
    }
  };
  
  const handleSaveBook = async (bookId: string) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    if (!bookToSave) return;

    if (!Auth.loggedIn()) {
      console.warn('User is not logged in.');
      return;
    }

    
    const { __typename, ...cleanBookData } = bookToSave;

    try {
      const { data } = await saveBook({
        variables: { book: cleanBookData }, 
      });

      console.log('✅ Book saved successfully:', data);
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };


  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error fetching books</h2>;

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book: GoogleBook) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds.includes(book.bookId)}
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds.includes(book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;





