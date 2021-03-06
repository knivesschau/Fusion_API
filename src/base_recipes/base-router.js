const express = require('express');
const BaseService = require('./base-service');
const {requireAuth} = require('../middleware/jwt-auth');

const baseRouter = express.Router();

// router to handle GET requests for all starter recipes from the API
baseRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        BaseService.getBaseRecipes(
            req.app.get('db')
        )
            .then(recipes => {
                res.json(recipes);
            })
            .catch(next);
    });

baseRouter
    .route('/:recipe_id')
    .all(requireAuth)
    .get((req, res, next) => {
        BaseService.getBaseById(
            req.app.get('db'),
            req.params.recipe_id
        )
            .then(base => {
                if (!base) {
                    return res.status(404).json({
                        error: {message: `Recipe does not exist.`}
                    })
                }
                res.json(base);
            })
            .catch(next);
    });

module.exports = baseRouter; 