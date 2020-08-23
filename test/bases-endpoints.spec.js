const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {makeBasesArray} = require('./base_recipe.fixtures');
const {makeCuisinesArray} = require('./cuisine.fixtures');
const supertest = require('supertest');

describe.only('base recipe endpoints', function() {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        });
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    beforeEach('clean up base recipes table', () => db('base_recipes').truncate());

    beforeEach('remove cuisines table', () => db('cuisines').delete());

    afterEach('cleanup fused recipes', () => db('base_recipes').truncate());

    afterEach('cleanup cuisines', () => db('cuisines').delete());

    describe(`GET /api/bases`, () => {
        context(`Given no base recipes in the database`, () => {
            it ('Responds with 200, but no base recipes', () => {
                return supertest(app)
                    .get('/api/bases')
                    .expect(200, [])
            });
        });

        context(`Given there are base recipes in the database`, () => {
            const testCuisines = makeCuisinesArray();
            const testBases = makeBasesArray();

            beforeEach('insert cuisines into database', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });

            beforeEach('insert base recipes into database', () => {
                return db
                    .into('base_recipes')
                    .insert(testBases)
            });
            
            it ('GET /api/bases responds with 200 and all base recipes', () => {
                return supertest(app)
                    .get('/api/bases')
                    .expect(200, testBases)
            });
        });
    });

    describe(`GET /api/bases/:recipe_id`, () => {
        context(`Given no base recipes in the database`, () => {
            it ('Responds with 404', () => {
                const baseId = 23450;

                return supertest(app)
                    .get(`/api/bases/${baseId}`)
                    .expect(404, {error: {message: `Recipe does not exist.`}})
            });
        });

        context(`Given there are base recipes in the database`, () => {
            const testCuisines = makeCuisinesArray();
            const testBases = makeBasesArray();

            beforeEach('insert cuisines into database', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });

            beforeEach('insert base recipes into database', () => {
                return db
                    .into('base_recipes')
                    .insert(testBases)
            });

            it ('GET /api/bases/:recipe_id responds 200 and with specific base recipe', () => {
                const baseId = 2;
                const expectedRecipe = testBases[baseId - 1];

                return supertest(app)
                    .get(`/api/bases/${baseId}`)
                    .expect(200, expectedRecipe)
            });
        });
    });
});