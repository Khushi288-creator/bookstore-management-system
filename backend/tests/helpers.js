const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const User = require('../models/User');
const Book = require('../models/Book');

const api = request(app);

const registerAndLogin = async ({ name, email, password, role }) => {
  if (role === 'admin') {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ name, email, password: hashedPassword, role: 'admin' });
  } else {
    await api.post('/api/register').send({ name, email, password });
  }

  const loginRes = await api.post('/api/login').send({ email, password });
  return {
    token: loginRes.body.token,
    user: loginRes.body.user,
  };
};

const createBook = async (adminToken, overrides = {}) => {
  const payload = {
    title: 'Test Book',
    author: 'Test Author',
    genre: 'fiction',
    isbn: `ISBN-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    price: 100,
    stock: 10,
    description: 'Test description',
    ...overrides,
  };

  const res = await api
    .post('/api/books')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(payload);

  return { res, book: res.body.data };
};

module.exports = { api, registerAndLogin, createBook, Book, User };
