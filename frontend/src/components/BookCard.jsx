import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const out = book.stock <= 0;

  return (
    <div className="card h-100">
      {book.imageUrl ? (
        <img src={book.imageUrl} alt={book.title} className="card-img-top book-img" />
      ) : (
        <div className="book-img d-flex align-items-center justify-content-center fs-1">📖</div>
      )}
      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-1">{book.title}</h6>
        <small className="text-muted">{book.author}</small>
        <span className="badge bg-secondary align-self-start my-2">{book.genre}</span>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <strong>₹{book.price}</strong>
          {out ? <span className="badge bg-danger">Out of stock</span> : <small className="text-success">{book.stock} left</small>}
        </div>
        <div className="d-flex gap-2 mt-3">
          <Link to={`/books/${book._id}`} className="btn btn-outline-dark btn-sm flex-fill">Details</Link>
          <button
            className="btn btn-dark btn-sm flex-fill"
            disabled={out}
            onClick={() => { addToCart(book, 1); toast.success('Added to cart'); }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
