const path = require('path');
const express = require('express');
const xss = require('xss');
const FuseService = require('./recipes-service');

const fuseRouter = express.Router();
const jsonParser = express.json();

const serializeRecipeEntry = recipe => ({
    fused_id: recipe.id,
    date_created: recipe.date_created,
    date_modified: recipe.date_modified,
    fuse_ingredients: xss(recipe.fuse_ingredients),
    fuse_steps: xss(recipe.fuse_steps),
    base_cuisine: recipe.base_cuisine,
    fuse_cuisine: recipe.fuse_cuisine
});

fuseRouter
    .route('/')
    .get((req, res, next) => {
        FuseService.getAllRecipes(
            req.app.get('db')
        )
        .then(recipes => {
            res.json(recipes)
        })
        .catch(next)
    });

fuseRouter
    .route('/:fused_id')
    .all((req, res, next) => {
        FuseService.getRecipeById(
            req.app.get('db'),
            req.params.fused_id
        )
            .then(recipe => {
                if (!recipe) {
                    return res.status(404).json({
                        error: {message:`Recipe does not exist.`}
                    });
                }
                res.recipe = recipe;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeRecipeEntry(res.recipe))
    });


module.exports = fuseRouter; 