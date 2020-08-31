const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {makeCuisinesArray} = require('./cuisine.fixtures');
const {makeUsersArray} = require('./users.fixtures');
const {makeAuthHeader} = require('./test-helpers');
const supertest = require('supertest');

describe ('Cuisine endpoints', function() {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    beforeEach('remove cuisines table', () => db('cuisines').delete());

    beforeEach('remove fused users table', () => db('fusion_users').delete());

    describe (`GET /api/cuisines`, () => {
        context(`Given no cuisines in the database`, () => {
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                return db
                    .into('fusion_users')
                    .insert(testUsers)
            });

            it ('Reponds with 200, but with no cuisines', () => {
                return supertest(app)
                    .get('/api/cuisines')
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, [])
            });
        });

        context(`Given there are cuisines in the database`, () => {
            const testCuisines = makeCuisinesArray();
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                return db
                    .into('fusion_users')
                    .insert(testUsers)
            });

            beforeEach('insert cuisines into database', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });

            it ('GET /api/cuisines responds with 200 and with all cuisines styles', () => {
                return supertest(app)
                    .get('/api/cuisines')
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, testCuisines)
            });
        });
    });

    describe(`GET /api/cuisines/:culinary_id`, () => {
        context(`Given there are no cuisines in the database`, () => {
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                return db
                    .into('fusion_users')
                    .insert(testUsers)
            });

            it ('Responds with 404', () => {
                const cuisineId = 200;

                return supertest(app)
                    .get(`/api/cuisines/${cuisineId}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404, {error: {message: `Cuisine does not exist.`}})
            });
        });

        context(`Given there are cuisines in the database`, () => {
            const testCuisines = makeCuisinesArray();
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                return db
                    .into('fusion_users')
                    .insert(testUsers)
            });

            beforeEach('insert cuisines into database', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });
            
            it ('GET /api/cuisines/:culinary_id responds 200 and with specific cuisine style', () => {
                const cuisineId = 4;
                const expectedCuisine = testCuisines[cuisineId - 1];

                return supertest(app)
                    .get(`/api/cuisines/${cuisineId}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, expectedCuisine)
            });
        });
    });
});