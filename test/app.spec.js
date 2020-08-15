const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200 containing a greeting message', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Welcome to the Fusion API!')
  });
})