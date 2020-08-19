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
    },
    insertRecipe(knex, newRecipe) {
        return knex
            .insert(newRecipe)
            .into('fused_recipes')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    deleteRecipe(knex, fused_id) {
        return knex('fused_recipes')
            .where({fused_id})
            .delete()
    },
}

module.exports = FuseService;