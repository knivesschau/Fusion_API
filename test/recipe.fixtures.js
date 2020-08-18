function makeRecipesArray() {
    return [
        {
            fused_id: 1, 
            fused_name: 'Avocado and Tomato Toast',
            date_created: '2020-08-01T16:28:32.615Z',
            date_modified: '2020-08-05T16:28:32.615Z',
            fuse_ingredients: 
            [
                '1 Avocado',
                'Pinch of Salt',
                '5 Cups Lorem', 
                '5 Tablespoons Ipsum', 
                '1/2 Teaspoon Dolor Sit Amet', 
                '1 1/2 Cups Tomatoes'
            ],
            fuse_steps: 
            [
                'Lorem ipsum dolor sit amet', 
                'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
                'Ut enim ad minim veniam, quis nostrud exercitation ullamco', 
                'Laboris nisi ut aliquip ex ea commodo consequat.'
            ],
            base_cuisine: 1,
            fuse_cuisine: 3
        },
        {   
            fused_id: 2, 
            fused_name: 'Potato and Cheese Crepes',
            date_created: '2020-08-05T16:28:32.615Z',
            date_modified: '2020-08-10T16:28:32.615Z',
            fuse_ingredients: ['1/2 Cup Milk', '4 large eggs', '1 Teaspoon Sugar', '1 lb potatoes, chopped', 'Pinch of Salt', '5 Cups Lorem', '5 Tablespoons Ipsum', '1/2 Teaspoon Dolor Sit Amet', '1 cup Cheddar cheese'],
            fuse_steps: ['Lorem ipsum dolor sit amet', 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco', 'Laboris nisi ut aliquip ex ea commodo consequat.'],
            base_cuisine: 4,
            fuse_cuisine: 1
        },
        {   
            fused_id: 3, 
            fused_name: 'Miso Spaghetti Carbonara',
            date_created: '2020-07-14T16:28:32.615Z',
            date_modified: '2020-08-31T16:28:32.615Z',
            fuse_ingredients: ['2 Tablespoons Miso Paste', '2 cups cold water', '1 Teaspoon Sugar', '1 whole can chopped tomatoes', '1/4 Cup Fresh Basil', 'Pinch of Salt', '5 Cups Lorem', '5 Tablespoons Ipsum', '1/2 Teaspoon Dolor Sit Amet'],
            fuse_steps: ['Lorem ipsum dolor sit amet', 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco', 'Laboris nisi ut aliquip ex ea commodo consequat.'],
            base_cuisine: 5,
            fuse_cuisine: 2
        },
    ];
};

module.exports = {
    makeRecipesArray
};