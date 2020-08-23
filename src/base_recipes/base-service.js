const BaseService = {
    getBaseRecipes(knex) {
        return knex
            .select('*')
            .from('base_recipes')
    },
    getBaseById(knex, recipe_id) {
        return knex
            .from('base_recipes')
            .select('*')
            .where('recipe_id', recipe_id)
            .first();            
    }
};

module.exports = BaseService; 