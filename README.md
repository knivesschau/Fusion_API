## Fusion App (API Server)

<a href="https://fusion-app.vercel.app//">Live Demo (Client)</a> 
<br>
<a href="https://github.com/knivesschau/Fusion">Client Repo</a>
<br>
<a href="https://github.com/knivesschau/Fusion_API">API Server</a>
<br>
<a href="https://afternoon-anchorage-79162.herokuapp.com/">Heroku API Server</a>

Fusion is an online recipe book tailor-made for chefs at all levels, allowing them to create and save recipe modifications, substitutions, and tweaks to their favorite culinary dishes. Users can create their own personalized recipe by book by having access to over 10 starting recipes across 7 exciting culinary styles.

## Image and Recipe Acknowledgements

This app uses free vectors and images designed or hosted by FreePik. Specific image sources are listed below: 

<a href="https://www.freepik.com/photos/background">Background photo created by freepik - www.freepik.com</a>
<br>
<a href="https://www.freepik.com/vectors/food">Food vector created by macrovector_official - www.freepik.com</a>

All starting recipes for Fusion come from <a href="https://www.allrecipes.com/">All Recipes</a>. This app was created primarily for educational and recreational purposes and does not seek a profit from it. 

## API Endpoints
```
GET (All recipes by user logged in)
  - /api/recipes 
  - /api/recipes/:fused_id 
```
```
GET (Starting recipe and cuisine data)
  - /api/bases (Starting Recipes)
  - /api/bases/:recipe_id 
  - /api/cuisines (Culinary Styles)
  - /api/cuisines/:culinary_id 
```
```
POST, DELETE, AND PATCH
  - /api/recipes/:fused_id 
```
```
USERS AND AUTHENTICATION
  - /api/users (Registration)
  - /api/auth/login (Login)
```

## Technologies Used
- ReactJS (Client)
- JSX (Client)
- CSS (Client)
- Express (Server)
- Node.JS (Server)
- Knex (Server)
- PostgreSQL (Server)
- Jest (Client Testing)
- Enzyme (Client Testing)
- Mocha (Server Testing)
- Chai (Server Testing)
- Supertest (Server Testing)

## Screenshots (Mobile)
<img src="https://user-images.githubusercontent.com/54642928/92090789-b8326d80-ed84-11ea-84e3-14e51a789d19.png" width="35%">
<img src="https://user-images.githubusercontent.com/54642928/92090793-b9fc3100-ed84-11ea-88d9-5ece8b7e62e9.png" width="35%">
<img src="https://user-images.githubusercontent.com/54642928/92090776-b5d01380-ed84-11ea-80df-ad325b309faf.png" width="35%">
<img src="https://user-images.githubusercontent.com/54642928/92090779-b7014080-ed84-11ea-8473-bdbec2ca5975.png" width="35%">

## Screenshots (Desktop)
<img src="https://user-images.githubusercontent.com/54642928/92090781-b7014080-ed84-11ea-8ffb-41b37091e97b.png" width="70%">
<img src="https://user-images.githubusercontent.com/54642928/92090762-b072c900-ed84-11ea-8a07-3ada850dc036.png" width="70%">
<img src="https://user-images.githubusercontent.com/54642928/92090791-b8cb0400-ed84-11ea-997b-ebcde2b02668.png" width="70%">
<img src="https://user-images.githubusercontent.com/54642928/92090778-b668aa00-ed84-11ea-9634-72b4d54d8bc3.png" width="70%">

## Concept Wire Frame 
<img src="https://user-images.githubusercontent.com/54642928/92093961-c5515b80-ed88-11ea-8497-a7e7cc13730a.png" width="70%">
