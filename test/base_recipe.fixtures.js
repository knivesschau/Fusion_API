function makeBasesArray() {
    return [
        {
            recipe_id: 1,
            base_name: "Base Test with Rice",
            ingredients: JSON.stringify(["2/3 cup Lorem Ipsum", "3 cups jasmine rice", "2 cups sit dolor amet", "4 teaspoons sugar", "1 cup vegetable broth"]),
            steps: JSON.stringify(["Cook rice according to package directions.", "In a pot, combine sugar and lorem ipsum. Bring to a boil and let simmer.", "Si dolor amet lorem ipsum, serve hot."]),
            cuisine_id: 2,
        },
        {
            recipe_id: 2,
            base_name: "GET Stir-Fry",
            ingredients: JSON.stringify(["2 lbs potatoes", "3/4 teaspoon Lorem ipsum", "2 bell peppers, sliced", "1/4 teaspoon salt, or to taste", "3 cups si dolor amet"]),
            steps: JSON.stringify(["Heat pan to high heat. Add potatoes and bell peppers. Cook until soft.", "Add lorem ipsum and si dolor amet. Continue cooking until aromatic.", "Serve over rice."]),
            cuisine_id: 3
        },
        {
            recipe_id: 3,
            base_name: "Testing Omelette",
            ingredients: JSON.stringify(["3 large eggs", "1 cup creme fraiche", "2 chives, chopped", "1/3 cup Lorem Ipsum"]),
            steps: JSON.stringify(["Crack eggs into pot over low heat. Stir continously on and off heat.", "When eggs begin to form, add creme fraiche. Continue to stir on and off until eggs solidify", "Add lorem ipsum and chives, serve over large slice of bread."]),
            cuisine_id: 4
        },
    ];
}

module.exports = {
    makeBasesArray
};