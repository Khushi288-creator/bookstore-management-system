const { api, registerAndLogin } = require('./helpers');

describe('Auth API', () => {
  it('registers a customer and logs in', async () => {
    const registerRes = await api.post('/api/register').send({
      name: 'Customer One',
      email: 'customer1@test.com',
      password: 'secret12',
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user.role).toBe('customer');
    expect(registerRes.body.token).toBeDefined();

    const loginRes = await api.post('/api/login').send({
      email: 'customer1@test.com',
      password: 'secret12',
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.message).toMatch(/successful/i);
  });

  it('ignores admin role in public register', async () => {
    const res = await api.post('/api/register').send({
      name: 'Fake Admin',
      email: 'fakeadmin@test.com',
      password: 'secret12',
      role: 'admin',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('customer');
  });

  it('returns current user on GET /api/auth/me', async () => {
    const { token } = await registerAndLogin({
      name: 'Me User',
      email: 'me@test.com',
      password: 'secret12',
    });

    const meRes = await api.get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe('me@test.com');
    expect(meRes.body.data.role).toBe('customer');
  });

  it('returns 401 for /api/auth/me without token', async () => {
    const res = await api.get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
