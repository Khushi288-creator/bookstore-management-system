import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import BookCard from '../components/BookCard';
import Spinner from '../components/Spinner';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/books?limit=4')
      .then((res) => setBooks(res.data.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="hero p-5 mb-4 text-center">
        <h1 className="display-5 fw-bold">Welcome to BookVerse</h1>
        <p className="lead">Discover, order and manage your favourite books.</p>
        <Link to="/books" className="btn btn-warning btn-lg">Browse Books</Link>
      </div>
      <h4 className="mb-3">Latest Books</h4>
      {loading ? <Spinner /> : error ? <div className="alert alert-danger">{error}</div> : (
        <div className="row g-3">
          {books.map((b) => <div className="col-6 col-md-3" key={b._id}><BookCard book={b} /></div>)}
          {books.length === 0 && <p className="text-muted">No books yet.</p>}
        </div>
      )}
    </>
  );
}
