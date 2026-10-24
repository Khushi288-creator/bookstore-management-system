import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { errMsg } from '../api';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>Nothing to checkout</h4>
        <Link to="/books" className="btn btn-dark mt-3">Browse books</Link>
      </div>
    );
  }

  const placeOrder = async () => {
    setLoading(true);
    try {
      await api.post('/api/orders', {
        items: items.map((i) => ({ book: i.book._id, quantity: i.quantity })),
      });
      clearCart();
      toast.success('Order placed successfully');
      navigate('/orders');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card p-4">
          <h3 className="mb-3">Order Summary</h3>
          <ul className="list-group mb-3">
            {items.map(({ book, quantity }) => (
              <li key={book._id} className="list-group-item d-flex justify-content-between">
                <span>{book.title} × {quantity}</span>
                <span>₹{book.price * quantity}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <span>Total</span><span>₹{total}</span>
            </li>
          </ul>
          <p className="text-muted small">Payment: Cash on delivery (payment gateway can be added later).</p>
          <div className="d-flex gap-2">
            <Link to="/cart" className="btn btn-outline-secondary">Back to cart</Link>
            <button className="btn btn-dark flex-fill" onClick={placeOrder} disabled={loading}>
              {loading ? 'Placing order...' : 'Place order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
