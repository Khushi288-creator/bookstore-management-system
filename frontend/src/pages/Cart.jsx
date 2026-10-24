import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>Your cart is empty</h4>
        <Link to="/books" className="btn btn-dark mt-3">Browse books</Link>
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-3">Your Cart</h3>
      <div className="table-responsive">
        <table className="table align-middle bg-white">
          <thead><tr><th>Book</th><th>Price</th><th style={{ width: 120 }}>Qty</th><th>Subtotal</th><th /></tr></thead>
          <tbody>
            {items.map(({ book, quantity }) => (
              <tr key={book._id}>
                <td><Link to={`/books/${book._id}`}>{book.title}</Link><br /><small className="text-muted">{book.author}</small></td>
                <td>₹{book.price}</td>
                <td>
                  <input type="number" min="1" max={book.stock} className="form-control form-control-sm" value={quantity}
                    onChange={(e) => updateQty(book._id, Number(e.target.value) || 1)} />
                </td>
                <td>₹{book.price * quantity}</td>
                <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(book._id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-secondary" onClick={() => window.confirm('Clear the cart?') && clearCart()}>Clear cart</button>
        <div className="text-end">
          <h4>Total: ₹{total}</h4>
          <button className="btn btn-dark" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
        </div>
      </div>
    </>
  );
}
