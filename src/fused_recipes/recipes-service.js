const FuseService = {
    getAllRecipes(knex) {
        return knex
            .select('*')
            .from('fused_recipes');
    },
    getRecipeById(knex, fused_id) {
        return knex
            .from('fused_recipes')
            .select('*')
            .where('fused_id', fused_id)
            .first();
    }
}

module.exports = FuseService;