import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api, { errMsg } from '../api';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api.get('/api/orders/my')
      .then((res) => setOrders(res.data.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await api.put(`/api/orders/${id}/cancel`);
      toast.success('Order cancelled');
      load();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <h3 className="mb-3">My Orders</h3>
      {orders.length === 0 && <p className="text-muted">You have not placed any orders yet.</p>}
      {orders.map((o) => (
        <div className="card mb-3" key={o._id}>
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <small className="text-muted">Order #{o._id.slice(-6).toUpperCase()} • {new Date(o.createdAt).toLocaleString()}</small>
            <div className="d-flex gap-2 align-items-center">
              <StatusBadge status={o.status} />
              <span className="badge bg-light text-dark border">{o.paymentStatus}</span>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            {o.items.map((it, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between">
                <span>{it.book?.title || 'Book'} × {it.quantity}</span>
                <span>₹{it.price * it.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="card-footer d-flex justify-content-between align-items-center">
            <strong>Total: ₹{o.totalPrice}</strong>
            {['pending', 'processing'].includes(o.status) && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(o._id)}>Cancel order</button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
