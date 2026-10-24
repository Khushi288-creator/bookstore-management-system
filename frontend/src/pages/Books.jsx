import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import BookCard from '../components/BookCard';
import Spinner from '../components/Spinner';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [filters, setFilters] = useState({ search: '', genre: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page, limit: 8 });
    if (filters.search) params.set('search', filters.search);
    if (filters.genre) params.set('genre', filters.genre);
    api.get(`/api/books?${params.toString()}`)
      .then((res) => {
        setBooks(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [page, filters]);

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    setFilters({ search: searchInput.trim(), genre: genreInput.trim() });
  };

  const reset = () => {
    setSearchInput('');
    setGenreInput('');
    setPage(1);
    setFilters({ search: '', genre: '' });
  };

  return (
    <>
      <h3 className="mb-3">All Books</h3>
      <form className="row g-2 mb-4" onSubmit={applyFilters}>
        <div className="col-md-5">
          <input className="form-control" placeholder="Search by title or author" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Genre (e.g. fiction)" value={genreInput} onChange={(e) => setGenreInput(e.target.value)} />
        </div>
        <div className="col-md-3 d-flex gap-2">
          <button className="btn btn-dark flex-fill" type="submit">Search</button>
          <button className="btn btn-outline-secondary flex-fill" type="button" onClick={reset}>Reset</button>
        </div>
      </form>

      {loading ? <Spinner /> : error ? <div className="alert alert-danger">{error}</div> : (
        <>
          <div className="row g-3">
            {books.map((b) => <div className="col-6 col-md-3" key={b._id}><BookCard book={b} /></div>)}
          </div>
          {books.length === 0 && <p className="text-muted">No books found.</p>}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button className="btn btn-outline-dark btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button className="btn btn-outline-dark btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </>
  );
}
