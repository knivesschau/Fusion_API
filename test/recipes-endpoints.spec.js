const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {makeRecipesArray} = require('./recipe.fixtures');
const {makeCuisinesArray} = require('./cuisine.fixtures');
const supertest = require('supertest');

describe('fused recipes endpoints', function() {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        });
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    before('clean fused recipes table', () => db('fused_recipes').truncate());

    beforeEach('remove cuisines table', () => db('cuisines').delete());

    afterEach('cleanup fused recipes', () => db('fused_recipes').truncate());

    afterEach('cleanup cuisines', () => db('cuisines').delete());

    describe(`GET /api/recipes`, () => {
        context(`Given no fused recipes in the database`, () => {
            it ('Responds with 200, but with no fused recipes', () => {
                return supertest(app)
                    .get('/api/recipes')
                    .expect(200, [])
            });
        });

        context(`Given there are fused recipes in the database`, () => {
            const testRecipes = makeRecipesArray();
            const testCuisines = makeCuisinesArray();
            
            beforeEach('insert cuisine styles', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });

            beforeEach('insert fused recipes', () => {
                return db
                    .into('fused_recipes')
                    .insert(testRecipes)
            });

            it ('GET /api/recipes responds 200 and with all saved recipes', () => {
                return supertest(app)
                    .get('/api/recipes')
                    .expect(200, testRecipes)
            });
        });
    });

    describe(`GET /api/recipes/:recipe_id`, () => {
        context(`Given there are no fused recipes in the database`, () => {
            it ('Responds with 404', () => {
                const recipeId = 23401;

                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .expect(404, {error: {message: `Recipe does not exist.`}});
            });
        });

        context(`Given there are fused recipes in the database`, () => {
            const testRecipes = makeRecipesArray();
            const testCuisines = makeCuisinesArray();

            beforeEach('insert cuisine styles', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });

            beforeEach('insert fused recipes', () => {
                return db
                    .into('fused_recipes')
                    .insert(testRecipes)
            });

            it ('GET /recipes/:recipe_id responds with 200 and the specific recipe', () => {
                const recipeId = 2;
                const expectedRecipe = testRecipes[recipeId - 1];
                
                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .expect(200, expectedRecipe)
            });
        });
    });

    describe(`POST /api/recipes/:recipe_id`, () => {        
        this.retries(3);

        const testCuisines = makeCuisinesArray();

        beforeEach('insert cuisine styles', () => {
            return db
                .into('cuisines')
                .insert(testCuisines)
        });

        const newRecipe = {
            fused_name: 'Potato Grilled Cheese',
            fuse_ingredients: JSON.stringify(['1 lb potatoes, cubed', '2 tomatoes, diced', '3/4 cup salsa', '4 cups lorem', '1/2 teaspoon ipsum']),
            fuse_steps: JSON.stringify(['In a pan, add potatoes and ipsum.', 'Set potatoes aside, season to taste.', 'Lorem ipsum sit dolor amet.', 'Amet lorem ipsum 1/2 servings.']),
            base_cuisine: 3,
            fuse_cuisine: 1
        };

        it ('Creates a fused recipe, responds 201 and with the recipe created', () => {
            return supertest(app)
                .post('/api/recipes')
                .send(newRecipe)
                .expect(201)
                .expect(res => {
                    expect(res.body.fused_name).to.eql(newRecipe.fused_name);
                    expect(res.body.fuse_ingredients).to.eql(newRecipe.fuse_ingredients);
                    expect(res.body.fuse_steps).to.eql(newRecipe.fuse_steps);
                    expect(res.body.base_cuisine).to.eql(newRecipe.base_cuisine);
                    expect(res.body.fuse_cuisine).to.eql(newRecipe.fuse_cuisine);
                    expect(res.body).to.have.property('fused_id');
                    expect(res.headers.location).to.eql(`/api/recipes/${res.body.id}`)

                    const expected = new Date().toLocaleString();
                    const actual = new Date(res.body.date_created).toLocaleString();

                    expect(actual).to.eql(expected);
                })
                .then(postRes => {
                    supertest(app)
                        .get(`/api/recipes/${postRes.body.fused_id}`)
                        .expect(postRes.body)
                });
        });

        const requiredFields = ['fused_name', 'fuse_ingredients', 'fuse_steps', 'base_cuisine'];

        requiredFields.forEach(field => {
            const newRecipe = {
                fused_name: 'Potato Grilled Cheese',
                fuse_ingredients: JSON.stringify(['1 lb potatoes, cubed', '2 tomatoes, diced', '3/4 cup salsa', '4 cups lorem', '1/2 teaspoon ipsum']),
                fuse_steps: JSON.stringify(['In a pan, add potatoes and ipsum.', 'Set potatoes aside, season to taste.', 'Lorem ipsum sit dolor amet.', 'Amet lorem ipsum 1/2 servings.']),
                base_cuisine: 3
            };

            it (`Responds with 400 and an error message when the ${field} is missing`, () => {
                delete newRecipe[field]

                return supertest(app)
                    .post('/api/recipes')
                    .send(newRecipe)
                    .expect(400, {
                        error: {message: `Missing '${field}' entry in request body.`}
                    });
            });
        });
    });

    describe (`DELETE /api/recipes/:recipe_id`, () => {
        context(`Given there are fused recipes in the database`, () => {
            it ('Responds with 404', () => {
                const recipeId = 2468;

                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .expect(404, { error: {message: `Recipe does not exist.`}})
            });
        });

        context(`Given there are recipes in the database`, () => {
            const testRecipes = makeRecipesArray();
            const testCuisines = makeCuisinesArray();

            beforeEach('insert cuisine styles', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });

            beforeEach('insert fused recipes', () => {
                return db
                    .into('fused_recipes')
                    .insert(testRecipes)
            });

            it ('Responds with 204 and removes the recipe', () => {
                const idToRemove = 3; 
                const expectedRecipe = testRecipes.filter(recipe => recipe.fused_id !== idToRemove);

                return supertest(app)
                    .delete(`/api/recipes/${idToRemove}`)
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get('/api/recipes')
                            .expect(expectedRecipe)
                    });
            });
        });
    });

    describe(`PATCH /api/recipes/:recipe_id`, () => {

    });
});