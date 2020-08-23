const express = require('express');
const CuisineService = require('./cuisine-service');

const cuisineRouter = express.Router();

cuisineRouter
    .route('/')
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