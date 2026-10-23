const { api, registerAndLogin, createBook } = require('./helpers');

describe('Books API', () => {
  let adminToken;
  let customerToken;

  beforeEach(async () => {
    ({ token: adminToken } = await registerAndLogin({
      name: 'Admin',
      email: 'admin-books@test.com',
      password: 'secret12',
      role: 'admin',
    }));
    ({ token: customerToken } = await registerAndLogin({
      name: 'Customer',
      email: 'customer-books@test.com',
      password: 'secret12',
    }));
  });

  it('lists books publicly', async () => {
    await createBook(adminToken, { title: 'Public List Book' });

    const res = await api.get('/api/books?search=Public');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('allows admin to create and delete a book', async () => {
    const { book } = await createBook(adminToken, { title: 'Delete Target' });
    expect(book._id).toBeDefined();

    const delRes = await api
      .delete(`/api/books/${book._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(delRes.status).toBe(200);

    const getRes = await api.get(`/api/books/${book._id}`);
    expect(getRes.status).toBe(404);
  });

  it('blocks customer from creating books', async () => {
    const res = await api
      .post('/api/books')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        title: 'Nope',
        author: 'X',
        genre: 'x',
        isbn: 'BLOCK-ISBN-1',
        price: 10,
        stock: 1,
      });

    expect(res.status).toBe(403);
  });

  it('returns 401 when creating book without token', async () => {
    const res = await api.post('/api/books').send({
      title: 'No Auth',
      author: 'X',
      genre: 'x',
      isbn: 'NO-AUTH-ISBN',
      price: 10,
      stock: 1,
    });

    expect(res.status).toBe(401);
  });
});
