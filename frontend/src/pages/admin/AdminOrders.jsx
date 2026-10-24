import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api, { errMsg } from '../../api';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENTS = ['unpaid', 'paid', 'refunded'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const q = filter ? `&status=${filter}` : '';
    api.get(`/api/orders?limit=100${q}`)
      .then((res) => setOrders(res.data.data))
      .catch((e) => toast.error(errMsg(e)))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const update = async (id, body) => {
    try {
      await api.put(`/api/orders/${id}/status`, body);
      toast.success('Order updated');
      load();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="mb-0">Manage Orders</h3>
        <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : (
        <div className="table-responsive">
          <table className="table table-sm align-middle bg-white">
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-6).toUpperCase()}<br /><small className="text-muted">{new Date(o.createdAt).toLocaleDateString()}</small></td>
                  <td>{o.user?.name || 'Deleted user'}<br /><small className="text-muted">{o.user?.email}</small></td>
                  <td>{o.items.map((it, i) => <div key={i}>{it.book?.title || 'Book'} × {it.quantity}</div>)}</td>
                  <td>₹{o.totalPrice}</td>
                  <td>
                    <StatusBadge status={o.status} />
                    <select className="form-select form-select-sm mt-1" value={o.status} onChange={(e) => update(o._id, { status: e.target.value })}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <select className="form-select form-select-sm" value={o.paymentStatus} onChange={(e) => update(o._id, { paymentStatus: e.target.value })}>
                      {PAYMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
