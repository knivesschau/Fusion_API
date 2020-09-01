const path = require('path');
const express = require('express');
const xss = require('xss');
const FuseService = require('./recipes-service');
const {requireAuth} = require('../middleware/jwt-auth');

const fuseRouter = express.Router();
const jsonParser = express.json();

const serializeRecipeEntry = recipe => ({
    fused_id: recipe.fused_id,
    fused_name: xss(recipe.fused_name),
    date_created: recipe.date_created,
    date_modified: recipe.date_modified,
    fuse_ingredients: xss(recipe.fuse_ingredients),
    fuse_steps: xss(recipe.fuse_steps),
    base_cuisine: recipe.base_cuisine,
    fuse_cuisine: recipe.fuse_cuisine,
    author_id: recipe.author_id
});

fuseRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        FuseService.getAllRecipes(
            req.app.get('db')
        )
        .then(recipes => {
            res.json(recipes);
        })
        .catch(next);
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const {fused_name, fuse_ingredients, fuse_steps, base_cuisine, fuse_cuisine} = req.body;
        const newRecipe = {fused_name, fuse_ingredients, fuse_steps, base_cuisine, fuse_cuisine}; 

        for (const [key, value] of Object.entries(newRecipe)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' entry in request body.`}
                });
            }
        }

        newRecipe.author_id = req.user.user_id;

        FuseService.insertRecipe(
            req.app.get('db'),
            newRecipe
        )
            .then(recipe => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${recipe.fusion_id}`))
                    .json(recipe)
            })
            .catch(next);
    });

fuseRouter
    .route('/:fused_id')
    .all(requireAuth)
    .all((req, res, next) => {
        FuseService.getRecipeById(
            req.app.get('db'),
            req.params.fused_id
        )
            .then(recipe => {
                if (!recipe) {
                    return res.status(404).json({
                        error: {message: `Recipe does not exist.`}
                    });
                }
                res.recipe = recipe;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeRecipeEntry(res.recipe));
    })
    .delete((req, res, next) => {
        FuseService.deleteRecipe(
            req.app.get('db'),
            req.params.fused_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const {fused_name, fuse_ingredients, fuse_steps} = req.body;
        const recipeToUpdate = {fused_name, fuse_ingredients, fuse_steps};
        const numberOfValues = Object.values(recipeToUpdate).filter(Boolean).length;

        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain updates to 'fused_name', 'fuse_ingredients', or 'fuse_steps'.`
                }
            });
        }

        FuseService.updateRecipe(
            req.app.get('db'),
            req.params.fused_id,
            recipeToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = fuseRouter; 