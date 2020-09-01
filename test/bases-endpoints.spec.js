const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {makeBasesArray} = require('./base_recipe.fixtures');
const {makeCuisinesArray} = require('./cuisine.fixtures');
const {makeUsersArray} = require('./users.fixtures');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe ('Base recipe endpoints', function() {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    beforeEach('clean up base recipes table', () => db('base_recipes').truncate());

    beforeEach('remove cuisines table', () => db('cuisines').delete());

    before('remove fused users table', () => db('fusion_users').delete());

    afterEach('cleanup fused recipes table', () => db('base_recipes').truncate());

    afterEach('cleanup fusion users table', () => db('fusion_users').delete());

    afterEach('cleanup cuisines table', () => db('cuisines').delete());

    describe (`GET /api/bases`, () => {
        context(`Given no base recipes in the database`, () => {
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });

            it ('Responds with 200, but no base recipes', () => {
                return supertest(app)
                    .get('/api/bases')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, [])
            });
        });

        context(`Given there are base recipes in the database`, () => {
            const testCuisines = makeCuisinesArray();
            let testBases = makeBasesArray();
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });

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
                
                //mimic join data
                const testRecipes = [
                    {
                      recipe_id: 1,
                      base_name: 'Base Test with Rice',
                      ingredients: '["2/3 cup Lorem Ipsum","3 cups jasmine rice","2 cups sit dolor amet","4 teaspoons sugar","1 cup vegetable broth"]',
                      steps: '["Cook rice according to package directions.","In a pot, combine sugar and lorem ipsum. Bring to a boil and let simmer.","Si dolor amet lorem ipsum, serve hot."]',
                      cuisine_id: 2,
                      culinary_id: 2,
                      cuisine_name: 'Asian'
                    },
                    {
                      recipe_id: 2,
                      base_name: 'GET Stir-Fry',
                      ingredients: '["2 lbs potatoes","3/4 teaspoon Lorem ipsum","2 bell peppers, sliced","1/4 teaspoon salt, or to taste","3 cups si dolor amet"]',
                      steps: '["Heat pan to high heat. Add potatoes and bell peppers. Cook until soft.","Add lorem ipsum and si dolor amet. Continue cooking until aromatic.","Serve over rice."]',
                      cuisine_id: 3,
                      culinary_id: 3,
                      cuisine_name: 'Vegan'
                    },
                    {
                      recipe_id: 3,
                      base_name: 'Testing Omelette',
                      ingredients: '["3 large eggs","1 cup creme fraiche","2 chives, chopped","1/3 cup Lorem Ipsum"]',
                      steps: '["Crack eggs into pot over low heat. Stir continously on and off heat.","When eggs begin to form, add creme fraiche. Continue to stir on and off until eggs solidify","Add lorem ipsum and chives, serve over large slice of bread."]',
                      cuisine_id: 4,
                      culinary_id: 4,
                      cuisine_name: 'French'
                    }
                  ];
                
                testBases = testRecipes;
                
                return supertest(app)
                    .get('/api/bases')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, testBases)
            });
        });
    });

    describe (`GET /api/bases/:recipe_id`, () => {
        context(`Given no base recipes in the database`, () => {
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });

            it ('Responds with 404', () => {
                const baseId = 23450;

                return supertest(app)
                    .get(`/api/bases/${baseId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {error: {message: `Recipe does not exist.`}})
            });
        });

        context(`Given there are base recipes in the database`, () => {
            const testCuisines = makeCuisinesArray();
            const testBases = makeBasesArray();
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });

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
                let expectedRecipe = testBases[baseId - 1];

                //mimic join data 
                const testRecipe =  {
                      recipe_id: 2,
                      base_name: 'GET Stir-Fry',
                      ingredients: '["2 lbs potatoes","3/4 teaspoon Lorem ipsum","2 bell peppers, sliced","1/4 teaspoon salt, or to taste","3 cups si dolor amet"]',
                      steps: '["Heat pan to high heat. Add potatoes and bell peppers. Cook until soft.","Add lorem ipsum and si dolor amet. Continue cooking until aromatic.","Serve over rice."]',
                      cuisine_id: 3,
                      culinary_id: 3,
                      cuisine_name: 'Vegan'
                };

                expectedRecipe = testRecipe;

                return supertest(app)
                    .get(`/api/bases/${baseId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedRecipe)
            });
        });
    });
});