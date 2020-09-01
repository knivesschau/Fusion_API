// service object to handle db queries to GET all starter recipe data 
const BaseService = {
    getBaseRecipes(knex) {
        return knex
            .select('*')
            .from('base_recipes')
            .innerJoin('cuisines', 'base_recipes.cuisine_id', '=', 'cuisines.culinary_id');
    },
    getBaseById(knex, recipe_id) {
        return knex
            .from('base_recipes')
            .select('*')
            .where('recipe_id', recipe_id)
            .innerJoin('cuisines', 'base_recipes.cuisine_id', '=', 'cuisines.culinary_id')
            .first();            
    }
};

module.exports = BaseService; 