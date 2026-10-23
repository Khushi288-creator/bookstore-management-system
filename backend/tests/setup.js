const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test_jwt_secret_for_jest_only';
}

const getTestMongoUri = () => {
  if (process.env.MONGO_URI_TEST) {
    return process.env.MONGO_URI_TEST;
  }
  if (process.env.MONGO_URI) {
    const uri = process.env.MONGO_URI;
    if (uri.includes('mongodb.net/')) {
      return uri.replace(/(mongodb\+srv:\/\/[^/]+\/)([^/?]+)/, '$1bookstore_test');
    }
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      return uri.replace(/\/([^/?]+)(\?|$)/, '/bookstore_test$2');
    }
  }
  throw new Error(
    'Set MONGO_URI (and optional MONGO_URI_TEST) in backend/.env before running tests'
  );
};

beforeAll(async () => {
  const uri = getTestMongoUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.connection.close();
});
