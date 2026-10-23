const { api, registerAndLogin, createBook, Book } = require('./helpers');

describe('Orders API', () => {
  let adminToken;
  let customerToken;
  let otherCustomerToken;
  let book;

  beforeEach(async () => {
    ({ token: adminToken } = await registerAndLogin({
      name: 'Admin',
      email: 'admin-orders@test.com',
      password: 'secret12',
      role: 'admin',
    }));
    ({ token: customerToken } = await registerAndLogin({
      name: 'Buyer',
      email: 'buyer@test.com',
      password: 'secret12',
    }));
    ({ token: otherCustomerToken } = await registerAndLogin({
      name: 'Other',
      email: 'other@test.com',
      password: 'secret12',
    }));

    ({ book } = await createBook(adminToken, { stock: 5, title: 'Order Book' }));
  });

  it('creates order and decreases stock', async () => {
    const orderRes = await api
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ book: book._id, quantity: 2 }] });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.data.totalPrice).toBe(200);

    const updatedBook = await Book.findById(book._id);
    expect(updatedBook.stock).toBe(3);
  });

  it('returns my orders for logged-in customer', async () => {
    await api
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ book: book._id, quantity: 1 }] });

    const myRes = await api.get('/api/orders/my').set('Authorization', `Bearer ${customerToken}`);

    expect(myRes.status).toBe(200);
    expect(myRes.body.count).toBe(1);
  });

  it('allows admin to list all orders', async () => {
    await api
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ book: book._id, quantity: 1 }] });

    const allRes = await api.get('/api/orders').set('Authorization', `Bearer ${adminToken}`);

    expect(allRes.status).toBe(200);
    expect(allRes.body.total).toBeGreaterThanOrEqual(1);
  });

  it('denies other customer from viewing someone else order', async () => {
    const orderRes = await api
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ book: book._id, quantity: 1 }] });

    const orderId = orderRes.body.data._id;

    const forbidden = await api
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${otherCustomerToken}`);

    expect(forbidden.status).toBe(403);
  });

  it('cancels order and restores stock', async () => {
    const orderRes = await api
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ book: book._id, quantity: 2 }] });

    const orderId = orderRes.body.data._id;
    let updatedBook = await Book.findById(book._id);
    expect(updatedBook.stock).toBe(3);

    const cancelRes = await api
      .put(`/api/orders/${orderId}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.data.status).toBe('cancelled');

    updatedBook = await Book.findById(book._id);
    expect(updatedBook.stock).toBe(5);
  });

  it('allows admin to update order status', async () => {
    const orderRes = await api
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ book: book._id, quantity: 1 }] });

    const orderId = orderRes.body.data._id;

    const statusRes = await api
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'processing', paymentStatus: 'paid' });

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.status).toBe('processing');
    expect(statusRes.body.data.paymentStatus).toBe('paid');
  });
});
