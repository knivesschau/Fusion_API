const FuseService = {
    getAllRecipes(knex) {
        return knex
            .select('fused_id', 'fused_name', 'date_created', 'date_modified', 'fuse_ingredients', 'fuse_steps', 'base_cuisine', 'fuse_cuisine', 'br.cuisine_name AS base_cuisine', 'fr.cuisine_name AS fuse_cuisine')
            .from('fused_recipes')
            .innerJoin('cuisines AS br', 'fused_recipes.base_cuisine', '=', 'br.culinary_id')
            .leftJoin('cuisines AS fr', 'fused_recipes.fuse_cuisine', '=', 'fr.culinary_id')
    },
    getRecipeById(knex, fused_id) {
        return knex
            .select('fused_id', 'fused_name', 'date_created', 'date_modified', 'fuse_ingredients', 'fuse_steps', 'base_cuisine', 'fuse_cuisine', 'br.cuisine_name AS base_cuisine', 'fr.cuisine_name AS fuse_cuisine')
            .from('fused_recipes')
            .where('fused_id', fused_id)
            .innerJoin('cuisines AS br', 'fused_recipes.base_cuisine', '=', 'br.culinary_id')
            .leftJoin('cuisines AS fr', 'fused_recipes.fuse_cuisine', '=', 'fr.culinary_id')
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
    updateRecipe(knex, fused_id, newRecipeFields) {
        return knex('fused_recipes')
            .where({fused_id})
            .update(newRecipeFields)
    }
};

module.exports = FuseService;