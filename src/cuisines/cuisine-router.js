const express = require('express');
const CuisineService = require('./cuisine-service');
const {requireAuth} = require('../middleware/jwt-auth');

const cuisineRouter = express.Router();

// router to handle GET requests for all cuisine styles from the API
cuisineRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        CuisineService.getCuisines(
            req.app.get('db')
        )
            .then(cuisines => {
                res.json(cuisines);
            })
            .catch(next);
    });

cuisineRouter
    .route('/:culinary_id')
    .all(requireAuth)
    .get((req, res, next) => {
        CuisineService.getCuisineById(
            req.app.get('db'),
            req.params.culinary_id
        )
            .then(cuisine => {
                if (!cuisine) {
                    return res.status(404).json({
                        error: {message: `Cuisine does not exist.`}
                    })
                }
                res.json(cuisine);
            })
            .catch(next);
    });

module.exports = cuisineRouter;