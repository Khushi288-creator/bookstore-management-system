import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api, { errMsg } from '../../api';
import Spinner from '../../components/Spinner';

const emptyForm = { title: '', author: '', price: '', genre: '', stock: '', isbn: '', description: '', imageUrl: '' };

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api.get('/api/books?limit=100')
      .then((res) => setBooks(res.data.data))
      .catch((e) => toast.error(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (b) => {
    setEditingId(b._id);
    setForm({
      title: b.title, author: b.author, price: b.price, genre: b.genre, stock: b.stock,
      isbn: b.isbn, description: b.description || '', imageUrl: b.imageUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => { setEditingId(null); setForm(emptyForm); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) {
        await api.put(`/api/books/${editingId}`, payload);
        toast.success('Book updated');
      } else {
        await api.post('/api/books', payload);
        toast.success('Book added');
      }
      reset();
      load();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete "${b.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/books/${b._id}`);
      toast.success('Book deleted');
      load();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  return (
    <>
      <h3 className="mb-3">Manage Books</h3>
      <form className="card p-3 mb-4" onSubmit={submit}>
        <h5>{editingId ? 'Edit book' : 'Add new book'}</h5>
        <div className="row g-2">
          <div className="col-md-4"><input className="form-control" name="title" placeholder="Title" required value={form.title} onChange={change} /></div>
          <div className="col-md-4"><input className="form-control" name="author" placeholder="Author" required value={form.author} onChange={change} /></div>
          <div className="col-md-4"><input className="form-control" name="genre" placeholder="Genre" required value={form.genre} onChange={change} /></div>
          <div className="col-md-3"><input className="form-control" type="number" min="0" name="price" placeholder="Price" required value={form.price} onChange={change} /></div>
          <div className="col-md-3"><input className="form-control" type="number" min="0" name="stock" placeholder="Stock" required value={form.stock} onChange={change} /></div>
          <div className="col-md-6"><input className="form-control" name="isbn" placeholder="ISBN" required value={form.isbn} onChange={change} /></div>
          <div className="col-md-12"><input className="form-control" name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={change} /></div>
          <div className="col-12"><textarea className="form-control" rows="2" name="description" placeholder="Description (optional)" value={form.description} onChange={change} /></div>
        </div>
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-dark" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update book' : 'Add book'}</button>
          {editingId && <button type="button" className="btn btn-outline-secondary" onClick={reset}>Cancel edit</button>}
        </div>
      </form>

      {loading ? <Spinner /> : (
        <div className="table-responsive">
          <table className="table table-sm align-middle bg-white">
            <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>Price</th><th>Stock</th><th /></tr></thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>₹{b.price}</td><td>{b.stock}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => startEdit(b)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(b)}>Delete</button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No books yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
