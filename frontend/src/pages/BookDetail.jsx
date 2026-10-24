import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { errMsg } from '../api';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';

export default function BookDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/books/${id}`)
      .then((res) => setBook(res.data.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const out = book.stock <= 0;

  return (
    <div className="row g-4">
      <div className="col-md-4">
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} className="img-fluid rounded" />
        ) : (
          <div className="book-img rounded d-flex align-items-center justify-content-center display-1">📖</div>
        )}
      </div>
      <div className="col-md-8">
        <Link to="/books" className="small">← Back to books</Link>
        <h2 className="mt-2">{book.title}</h2>
        <p className="text-muted mb-1">by {book.author}</p>
        <span className="badge bg-secondary me-2">{book.genre}</span>
        <small className="text-muted">ISBN: {book.isbn}</small>
        <h3 className="my-3">₹{book.price}</h3>
        <p>{book.description || 'No description available.'}</p>
        <p className={out ? 'text-danger' : 'text-success'}>{out ? 'Out of stock' : `${book.stock} in stock`}</p>
        {!out && (
          <div className="d-flex gap-2" style={{ maxWidth: 260 }}>
            <input type="number" min="1" max={book.stock} className="form-control" value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value) || 1, book.stock)))} />
            <button className="btn btn-dark" onClick={() => { addToCart(book, qty); toast.success('Added to cart'); }}>Add to cart</button>
          </div>
        )}
      </div>
    </div>
  );
}
