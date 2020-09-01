const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {makeRecipesArray} = require('./recipe.fixtures');
const {makeUsersArray} = require('./users.fixtures');
const {makeCuisinesArray} = require('./cuisine.fixtures');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe ('Protected Endpoints', function() {
    let db;

    const testRecipes = makeRecipesArray();
    const testUsers = makeUsersArray();
    const testCuisines = makeCuisinesArray();

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean fused recipes table', () => db('fused_recipes').truncate());

    beforeEach('remove cuisines table', () => db('cuisines').delete()); 

    beforeEach('remove fused users table', () => db('fusion_users').delete());

    afterEach('clean up fused recipes table', () => db('fused_recipes').truncate());

    afterEach('clean cuisines table', () => db('cuisines').delete()); 
    
    afterEach('clean up fusion users table', () => db('fusion_users').delete());

    beforeEach('insert cuisine styles', () => {
        return db
            .into('cuisines')
            .insert(testCuisines)
    });
    
    beforeEach('insert test users', () => {
        return db
            .into('fusion_users')
            .insert(testUsers)
    });

    beforeEach('insert fused recipes', () => {
        return db
            .into('fused_recipes')
            .insert(testRecipes)
    });

    const protectedEndpoints = [
        {
            name: `GET /api/recipes`,
            path: '/api/recipes/',
            method: supertest(app).get,
        },
        {
            name: `GET /api/recipes/:fused_id`,
            path: '/api/recipes/1',
            method: supertest(app).get,
        },
        {
            name: `POST /api/recipes`,
            path: '/api/recipes/',
            method: supertest(app).post
        },
        {
            name: `GET /api/bases`,
            path: '/api/bases/',
            method: supertest(app).get
        },
        {
            name: `GET /api/bases/:recipe_id`,
            path: '/api/bases/1',
            method: supertest(app).get
        },
        {
            name: `GET /api/cuisines`,
            path: '/api/cuisines/',
            method: supertest(app).get
        },
        {
            name: `GET /api/cuisines/:culinary_id`,
            path: '/api/cuisines/1',
            method: supertest(app).get
        }
    ];

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
            it (`Responds 401 'Missing bearer token' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                    .expect(401, {error: `Missing bearer token`})
            });

            it (`Responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0];
                const invalidSecret = 'bad-secret';

                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, {error: `Unauthorized request`})
            });

            it (`Responds with 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = {user_name: 'fake-user', user_id: 1};

                return supertest(app)
                    .get(`/api/recipes/1`)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, {error: `Unauthorized request`})
            });
        });
    });
});