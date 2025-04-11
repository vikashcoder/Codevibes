const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Session = require('../models/Session');

let token;
let userId;
let sessionId;

const testUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'test123',
  gender: 'male',
};

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://vikash29raj:vikash@cluster0.abkydjo.mongodb.net/codes?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany({ username: testUser.username });
  await Session.deleteMany({});

  // Register the user
  const regRes = await request(app)
    .post('/api/auth/register')
    .send(testUser);
  expect(regRes.statusCode).toBe(201);

  // Login the user
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: testUser.username, password: testUser.password });

  expect(loginRes.statusCode).toBe(200);
  token = loginRes.body.token;

  const user = await User.findOne({ username: testUser.username });
  userId = user._id.toString();
});

afterAll(async () => {
  await Session.deleteMany({});
  await User.deleteMany({ username: testUser.username });
  await mongoose.connection.close();
});

describe('Full Auth + Session Flow', () => {
  test('should create a session', async () => {
    const res = await request(app)
      .post('/api/sessions/create')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.creator.username).toBe(testUser.username);
    sessionId = res.body.sessionId;
  });

  test('should join a session', async () => {
    const res = await request(app)
      .post('/api/sessions/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId });

    expect(res.statusCode).toBe(200);
    expect(res.body.sessionId).toBe(sessionId);
    expect(res.body.participants).toContain(userId);
  });

  test('should update session code', async () => {
    const code = 'console.log("Hello CodeVibe!")';
    const res = await request(app)
      .post('/api/sessions/update-code')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId, code });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Code updated');
  });
});
