BEGIN;

TRUNCATE
    fused_recipes,
    fusion_users
    RESTART IDENTITY CASCADE;

INSERT INTO fusion_users (user_name, password) (
    VALUES
        ('test_user1', 'testerPassword123'),
        ('test_user2', 'passwordTester431'),
        ('test_user3', 'IloveTestData35'),
        ('test_user4', 'MockDataFan32')
);

INSERT INTO fused_recipes (fused_name, fuse_ingredients, fuse_steps, base_cuisine, fuse_cuisine, author_id) (
    VALUES
        (
            'Protected Entries and Potatoes',
            
            '2 cups lorem ipsum
            2 tablespoons si dolor amet
            3 cups water
            3/4 cup low-sodium soy sauce
            1 bell pepper, diced finely
            1/2 teaspoon white sugar
            2 lbs potatoes, diced',

            'Heat skillet to medium high heat. Add lorem ipsum and bell pepper and stir-fry.
            Add potatoes, sugar, and si dolor amet. Continue cooking until potatoes are soft.
            Add water and soy sauce, stir to combine. Bring to a boil and let simmer 40 minutes. Serve immediately.',

            6,
            1,
            1
        ),
        (
            'Fruit with Protected Entries',
            
            '1 cup lorem ipsum
            2/3 tablespoons si dolor amet
            1 package of strawberries, rinsed
            2 cups whipped cream 
            1/2 teaspoon white sugar',

            'Rinse strawberries thoroughly. Cut tops and discard.  
            Put strawberries in a bowl and add sugar and lorem ipsum. Toss to coat evenly. 
            Add the whipped cream and si dolor amet. Serve immediately or chill in fridge.',
            
            3,
            8,
            2
        ),
        (
            'Protected Pasta',
            
            '1 jar of marinara sauce
            1 lb of dried spaghetti
            1 cup canned diced tomatoes
            1/2 onion, chopped
            1 pinch of salt, or to taste
            1 pinch of pepper, or taste
            1/4 cup shredded mozarella cheese',

            'Boil spaghetti according to package instructions. Drain and set aside some pasta water.
            Heat sauce pan to medium-high heat. In a pan, add onions and diced tomatoes, sautee until tomatoes become soft. Add salt and peper to taste.
            Add marianara sauce and bring to a boil. Add pasta water and simmer for 20 minutes.
            Add spaghetti and toss to combine sauce and noodles thoroughly. Sprinkle with mozarella cheese and serve.',
            
            4,
            7,
            3
        ),
        (
            'Protected Grilled Cheese',
            
            '2 slices pepperjack cheese
            1/4 cup shredded Mexican cheese
            4 slices of white bread
            1/4 cup salsa roja
            3 tablespoons of butter',

            'Preheat skillet over medium heat.
            Generously butter one side of a slice of bread; place bread butter-side-down onto skillet bottom and add 1 slice of pepperjack cheese and half of the shredded cheese.
            Butter a second slice of bread on one side, spread salsa, and place butter-side-up on top of sandwich, grill until lightly browned and flip over. 
            Continue grilling until cheese is melted.
            Repeat with remaining 2 slices of bread, butter and slice of cheese.',
            
            1,
            5,
            1
        )
);

COMMIT;