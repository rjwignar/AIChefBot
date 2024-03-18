
// Module for caching recipes in session storage
// a) User registers when they generate a recipe they like
// b) User navigates from page and wants to see the same recipes

export function cacheRecipes(recipes) {
    console.log("Caching " + recipes.length + " recipes...");
    for (let i=0; i < recipes.length; i++) {
        sessionStorage.setItem(i, JSON.stringify(recipes[i]));
    }
}

export function fetchCachedRecipes() {
    console.log("Fetching recipes from cache...");
    let recipes = []
    for (let i=0; i < 3; i++) {
        const recipeString = sessionStorage.getItem(i);
        if (recipeString) {
            recipes.push(JSON.parse(recipeString));
        }
    }
    console.log(recipes.length ? recipes.length : 0 + " recipes found!");
    return recipes;
}