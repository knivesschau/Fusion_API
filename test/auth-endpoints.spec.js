const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const {makeUsersArray} = require('./users.fixtures');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe ('Authorized Endpoints', function() {
    let db; 

    const testUsers = makeUsersArray();
    const testUser = testUsers[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    afterEach('cleanup fused recipes table', () => db('fused_recipes').truncate());

    afterEach('cleanup cuisines table', () => db('cuisines').delete());

    afterEach('cleanup fused users table', () => db('fusion_users').delete());

    describe (`POST /api/auth/login`, () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(db, testUsers)
        });

        beforeEach('insert cuisines table', () => {
            return db
                .into('cuisines')
        });

        beforeEach('insert recipe table', () => {
            return db
                .into('fused_recipes')
        });

        const requiredFields = ['user_name', 'password'];

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                user_name: testUser.user_name,
                password: testUser.password
            };

            it (`Responds with 400 'required' error when ${field} is missing`, () => {
                delete loginAttemptBody[field];

                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400, {error: `Missing ${field} in request body`})
            });

            it (`Responds 400 'incorrect user_name or password' when bad creds provided`, () => {
                const invalidUser = {user_name: 'not-good-user', password: 'notapassword10'};

                return supertest(app)
                    .post('/api/auth/login')
                    .send(invalidUser)
                    .expect(400, {error: `Incorrect user_name or password`})
            });

            it (`Responds 400 'incorrect user_name or password' when bad password`, () => {
                const badPassword = {user_name: testUser.user_name, password: 'incoRRECT!!!!'};

                return supertest(app)
                    .post('/api/auth/login')
                    .send(badPassword)
                    .expect(400, {error: `Incorrect user_name or password`})
            });

            it (`Responds 200 and JWT auth token using a secret when valid credentials provided`, () => {
                const validCreds = {
                    user_name: testUser.user_name,
                    password: testUser.password
                };

                const expectedToken = jwt.sign(
                    {user_id: testUser.user_id},
                    process.env.JWT_SECRET,
                    {
                        subject: testUser.user_name,
                        expiresIn: process.env.JWT_EXPIRY,
                        algorithm: 'HS256'
                    }
                );

                return supertest(app)
                    .post('/api/auth/login')
                    .send(validCreds)
                    .expect(200, {
                        authToken: expectedToken
                    })
            });
        });
    });
});