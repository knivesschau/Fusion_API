const CuisineService = {
    getCuisines(knex) {
        return knex
            .select('*')
            .from('cuisines')
    },
    getCuisineById(knex, culinary_id) {
        return knex
            .from('cuisines')
            .select('*')
            .where('culinary_id', culinary_id)
            .first();            
    }
};

module.exports = CuisineService;