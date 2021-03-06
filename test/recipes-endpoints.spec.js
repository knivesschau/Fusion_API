const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {makeRecipesArray} = require('./recipe.fixtures');
const {makeCuisinesArray} = require('./cuisine.fixtures');
const {makeUsersArray} = require('./users.fixtures');
const supertest = require('supertest');
const helpers = require('./test-helpers');

describe ('Fused recipes endpoints', function() {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean fused recipes table', () => db('fused_recipes').truncate());

    before('remove cuisines table', () => db('cuisines').delete());

    before('remove fused users table', () => db('fusion_users').delete());

    afterEach('cleanup fused recipes', () => db('fused_recipes').truncate());

    afterEach('cleanup cuisines', () => db('cuisines').delete());

    afterEach('clean up fusion users table', () => db('fusion_users').delete());

    describe (`GET /api/recipes`, () => {
        context(`Given no fused recipes in the database`, () => {
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });
            
            it ('Responds with 200, but with no fused recipes', () => {
                return supertest(app)
                    .get('/api/recipes')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, [])
            });
        });

        context(`Given there are fused recipes in the database`, () => {
            let testRecipes = makeRecipesArray();
            const testUsers = makeUsersArray();
            const testCuisines = makeCuisinesArray();
            const validUser = testUsers[0];
            
            beforeEach('insert cuisine styles', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });

            beforeEach('insert fused recipes', () => {
                return db
                    .into('fused_recipes')
                    .insert(testRecipes)
            });

            it ('GET /api/recipes responds 200 and with all entries written by user logged in', () => {
                // mimic the joined table data from fused_recipes and cuisines  
                let joinData = [
                    {
                      fused_id: 1,
                      fused_name: 'Avocado and Tomato Toast',
                      date_created: '2020-08-01T16:28:32.615Z',
                      date_modified: '2020-08-05T16:28:32.615Z',
                      fuse_ingredients: '["1 Avocado","Pinch of Salt","5 Cups Lorem","5 Tablespoons Ipsum","1/2 Teaspoon Dolor Sit Amet","1 1/2 Cups Tomatoes"]',
                      fuse_steps: '["Lorem ipsum dolor sit amet","consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","Ut enim ad minim veniam, quis nostrud exercitation ullamco","Laboris nisi ut aliquip ex ea commodo consequat."]',
                      base_cuisine: "Vegan",
                      fuse_cuisine: "American",
                      author_id: 1
                    },
                  ];

                // set original mock data equal to joined data. 
                testRecipes = joinData;

                return supertest(app)
                    .get('/api/recipes')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, testRecipes, validUser)
            });
        });
    });

    describe (`GET /api/recipes/:recipe_id`, () => {
        context(`Given there are no fused recipes in the database`, () => {
            const testUsers = makeUsersArray();

            before('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });
            
            it ('Responds with 404', () => {
                const recipeId = 23401;

                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {error: {message: `Recipe does not exist.`}})
            });
        });

        context(`Given there are fused recipes in the database`, () => {
            const testRecipes = makeRecipesArray();
            const testUsers = makeUsersArray();
            const testCuisines = makeCuisinesArray();

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });
            
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
                const recipeId = 1;
                let expectedRecipe = testRecipes[recipeId];
                
                // mimic the joined table data from fused_recipes and cuisines  
                const joinDataById = {
                    fused_id: 1,
                    fused_name: 'Avocado and Tomato Toast',
                    date_created: '2020-08-01T16:28:32.615Z',
                    date_modified: '2020-08-05T16:28:32.615Z',
                    fuse_ingredients: '["1 Avocado","Pinch of Salt","5 Cups Lorem","5 Tablespoons Ipsum","1/2 Teaspoon Dolor Sit Amet","1 1/2 Cups Tomatoes"]',
                    fuse_steps: '["Lorem ipsum dolor sit amet","consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","Ut enim ad minim veniam, quis nostrud exercitation ullamco","Laboris nisi ut aliquip ex ea commodo consequat."]',
                    base_cuisine: "Vegan",
                    fuse_cuisine: "American",
                    author_id: 1
                };

                expectedRecipe = joinDataById;
                
                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedRecipe)
            });
        });

        context(`Given an XSS attack recipe entry`, () => {
            const testCuisines = makeCuisinesArray();
            const testUsers = makeUsersArray();

            const badRecipe = {
                fused_id: 411, 
                fused_name: 'Recipe name BAD CODE <script>alert("xss");</script>',
                fuse_ingredients: JSON.stringify(['4 cups milk', '2 teaspoons of salt', '1 cup of BAD CODE <script>alert("xss");</script>']),
                fuse_steps: `Step 1 make a MALICIOUS ENTRY BAD IMG "https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);"&gt`,
                base_cuisine: 2, 
                fuse_cuisine: 3,
                author_id: 1
            };

            beforeEach('insert cuisine styles', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });

            beforeEach('insert xss recipe', () => {
                return db
                    .into('fused_recipes')
                    .insert([badRecipe])
            });

            it ('Removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/recipes/${badRecipe.fused_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.fused_name).to.eql('Recipe name BAD CODE &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
                        expect(res.body.fuse_ingredients).to.eql(JSON.stringify(['4 cups milk', '2 teaspoons of salt', '1 cup of BAD CODE &lt;script&gt;alert(\"xss\");&lt;/script&gt;']));
                        expect(res.body.fuse_steps).to.eql(`Step 1 make a MALICIOUS ENTRY BAD IMG "https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);"&gt`);
                    });
            });
        });
    });

    describe (`POST /api/recipes/:recipe_id`, () => {        
        this.retries(3);

        const testCuisines = makeCuisinesArray();
        const testUsers = makeUsersArray();

        beforeEach('insert cuisine styles', () => {
            return db
                .into('cuisines')
                .insert(testCuisines)
        });

        beforeEach('insert test users', () => {
            helpers.seedUsers(db, testUsers)
        });

        const newRecipe = {
            fused_name: 'Potato Grilled Cheese',
            fuse_ingredients: JSON.stringify(['1 lb potatoes, cubed', '2 tomatoes, diced', '3/4 cup salsa', '4 cups lorem', '1/2 teaspoon ipsum']),
            fuse_steps: JSON.stringify(['In a pan, add potatoes and ipsum.', 'Set potatoes aside, season to taste.', 'Lorem ipsum sit dolor amet.', 'Amet lorem ipsum 1/2 servings.']),
            base_cuisine: 3,
            fuse_cuisine: 1,
            author_id: 1
        };

        it ('Creates a fused recipe, responds 201 and with the recipe created', () => {
            return supertest(app)
                .post('/api/recipes')
                .send(newRecipe)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(201)
                .expect(res => {
                    expect(res.body.fused_name).to.eql(newRecipe.fused_name);
                    expect(res.body.fuse_ingredients).to.eql(newRecipe.fuse_ingredients);
                    expect(res.body.fuse_steps).to.eql(newRecipe.fuse_steps);
                    expect(res.body.base_cuisine).to.eql(newRecipe.base_cuisine);
                    expect(res.body.fuse_cuisine).to.eql(newRecipe.fuse_cuisine);
                    expect(res.body).to.have.property('fused_id');
                    expect(res.author_id).to.eql(testUsers.user_id);
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

        const requiredFields = ['fused_name', 'fuse_ingredients', 'fuse_steps', 'base_cuisine', 'fuse_cuisine'];

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
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(400, {
                        error: {message: `Missing '${field}' entry in request body.`}
                    });
            });
        });
    });

    describe (`DELETE /api/recipes/:recipe_id`, () => {
        context(`Given there are fused recipes in the database`, () => {
            const testUsers = makeUsersArray();
            
            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });

            it ('Responds with 404', () => {
                const recipeId = 2468;

                return supertest(app)
                    .get(`/api/recipes/${recipeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: {message: `Recipe does not exist.`}})
            });
        });

        context(`Given there are recipes in the database`, () => {
            const testRecipes = makeRecipesArray();
            const testUsers = makeUsersArray();
            const testCuisines = makeCuisinesArray();

            beforeEach('insert cuisine styles', () => {
                return db
                    .into('cuisines')
                    .insert(testCuisines)
            });

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });

            beforeEach('insert fused recipes', () => {
                return db
                    .into('fused_recipes')
                    .insert(testRecipes)
            });

            it ('Responds with 204 and removes the recipe', () => {
                const idToRemove = 1; 
                const expectedRecipe = testRecipes.filter(recipe => recipe.fused_id !== idToRemove);

                return supertest(app)
                    .delete(`/api/recipes/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get('/api/recipes')
                            .expect(expectedRecipe)
                    });
            });
        });
    });

    describe (`PATCH /api/recipes/:recipe_id`, () => {
        context(`Given there are no fused recipes in the database`, () => {
            const testUsers = makeUsersArray();

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });
            
            it ('Responds with 404', () => {
                const recipeId = 51015;

                return supertest(app)
                    .patch(`/api/recipes/${recipeId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {
                        error: {message: `Recipe does not exist.`}
                    })
            });
        });

        context(`Given there are fused recipes in the database`, () => {
            const testRecipes = makeRecipesArray();
            const testUsers = makeUsersArray();
            const testCuisines = makeCuisinesArray();

            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            });
            
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

            it ('Responds with 204 and updates the recipe', () => {
                const idToUpdate = 1;

                const updatedRecipe = {
                    fused_name: "Patch with Potatoes",
                    fuse_ingredients: JSON.stringify(['4 eggs', '1/2 cup of milk', '4 cups water', '2 pounds of PATCH', '1/2 cup of debugging']),
                    fuse_steps: JSON.stringify(['In a pan, add eggs, PATCH, and debugging.', 'Once cooked, add water and milk and bring to a boil. Simmer for 35 minutes.', 'Season to taste.'])
                };

                const expectedEntry = {
                    ...testRecipes[idToUpdate - 1],
                    ...updatedRecipe
                };

                return supertest(app)
                    .patch(`/api/recipes/${idToUpdate}`)
                    .send(updatedRecipe)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get(`/get/recipes/${idToUpdate}`)
                            .expect(expectedEntry)
                    });
            });

            it ('Responds with 400 when no required fields are sent', () => {
                const idToUpdate = 1;

                return supertest(app)
                    .patch(`/api/recipes/${idToUpdate}`)
                    .send({badField: 'bar'})
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(400, {
                        error: {
                            message: `Request body must contain updates to 'fused_name', 'fuse_ingredients', or 'fuse_steps'.`
                        }
                    });
            });

            it ('Responds with 204 when updating only a subset of fields', () => {
                const idToUpdate = 1;

                const updateRecipe = {
                    fused_name: "Potatoes and Patch Gravy"
                };

                return supertest(app)
                    .patch(`/api/recipes/${idToUpdate}`)
                    .send({
                        ...updateRecipe,
                        ignore: 'Blah'
                    })
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get(`/api/recipes/${idToUpdate}`)
                            .expect(updateRecipe)
                    });
            });
        });
    });
});