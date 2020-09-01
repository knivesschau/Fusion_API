const {expect} = require('chai');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const {makeUsersArray} = require('./users.fixtures');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe ('User Endpoints', () => {
    let db; 

    const testUsers = makeUsersArray();
    const testUser = testUsers[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    beforeEach('remove fused users table', () => db('fusion_users').delete());

    afterEach('clean up fused recipes table', () => db('fused_recipes').delete());

    afterEach('clean up fused users table', () => db('fusion_users').delete());

    describe (`POST /api/users`, () => {
        context ('User Validation', () => {
            
            beforeEach('insert users', () => {
                helpers.seedUsers(db, testUsers)
            });

            const requiredFields = ['user_name', 'password'];

            requiredFields.forEach(field => {
                const registerAttempt = {
                    user_name: 'test user_name',
                    password: 'test password'
                };

                it (`Responds with 400 when required ${field} is missing`, () => {
                    delete registerAttempt[field];

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttempt)
                        .expect(400, {error: `Missing ${field} in request body.`})
                });
            });

            it ('Responds with 400 when password is less than 8 characters', () => {
                const shortPassword = {
                    user_name: 'test user_name',
                    password: '1234567'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(shortPassword)
                    .expect(400, {error: `Password must be longer than 8 characters.`})
            });

            it ('Responds 400 when password is less than 72 characters', () => {
                const longPassword = {
                    user_name: 'test user_name',
                    password: '*'.repeat(73)
                };

                return supertest(app)
                    .post('/api/users')
                    .send(longPassword)
                    .expect(400, {error: `Password must be less than 72 characters.`})
            });

            it ('Responds 400 when password begins with a space', () => {
                const spacePassword = {
                    user_name: 'test user_name',
                    password: ' y0uveBeenChopped!'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(spacePassword)
                    .expect(400, {error: `Password must not start or end with a space.`})
            });

            it ('Responds 400 when password ends with a space', () => {
                const spacePassword ={ 
                    user_name: 'test user_name',
                    password: 'y0uveBeenChopped! '
                }

                return supertest(app)
                    .post('/api/users')
                    .send(spacePassword)
                    .expect(400, {error: `Password must not start or end with a space.`})
            });

            it ('Responds 400 when password is not complex enough', () => {
                const basicPassword = {
                    user_name: 'test user_name',
                    password: '11AAffbbb'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(basicPassword)
                    .expect(400, {error: `Password must contain 1 upper case, lower case, number, and special character.`})
            });

            it (`Responds 400 'Username already taken' when user_name is not unique`, () => {
                const duplicateUser = {
                    user_name: testUser.user_name,
                    password: '11AAaa!!'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(duplicateUser)
                    .expect(400, {error: `Username already taken.`})
            });
        });
    });

    describe (`Sucessful user POST request`, () => {
        it ('Responds 201, serializes user, and stores bcrypted password', () => {
            const newUser = {
                user_name: "test user_name",
                password: "11AAaa!!"
            };

            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('user_id');
                    expect(res.body.user_name).to.eql(newUser.user_name);
                    expect(res.body).to.not.have.property('password');
                    expect(res.headers.location).to.eql(`/api/users/${res.body.user_id}`);

                    const expectedDate = new Date().toLocaleString('en', {timezone: 'UTC'});
                    const actualDate = new Date(res.body.date_created).toLocaleString();

                    expect(actualDate).to.eql(expectedDate);
                })
                .expect(res => {
                    db
                        .from('fusion_users')
                        .select('*')
                        .where({user_id: res.body.user_id})
                        .first()
                        .then(row => {
                            expect(row.user_name).to.eql(newUser.user_name);

                            const expectedDate = new Date().toLocaleString('en', {timezone: 'UTC'});
                            const actualDate = new Date(res.body.date_created).toLocaleString();

                            expect(actualDate).to.eql(expectedDate);

                            return bcrypt.compare(newUser.password, row.password);
                        })
                        .then(compareMatch => {
                            expect(compareMatch).to.be.true;
                        });
                });
        });
    });
});