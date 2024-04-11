
// Cache recipes and which page they were generated from

export function setCache(data) {
    sessionStorage.setItem("recipes", JSON.stringify(data.recipes));
    sessionStorage.setItem("messageHistory", JSON.stringify(data.messageHistory));
    // Which page were the recipes generated from?
    // If both are true, ingredients + diet
    // Otherwise, ingredients OR diet
    sessionStorage.setItem('selectedIngredients', data.selectedIngredients ? true : false);
    sessionStorage.setItem('selectedDiet', data.selectedDiet ? true : false);
}

export function getCache() {
    return {
        recipes: JSON.parse(sessionStorage.getItem("recipes")),
        messageHistory: JSON.parse(sessionStorage.getItem("messageHistory")),
        selectedIngredients: JSON.parse(sessionStorage.getItem("selectedIngredients")),
        selectedDiet: JSON.parse(sessionStorage.getItem("selectedDiet")),
    }
}

export function cacheSetSaved(recipe, id) {
    // Get recipes
    let recipes = JSON.parse(sessionStorage.getItem("recipes"));
    // For each recipe
    for (let e of recipes) {
        // If recipe matches, give _id property
        if (e.name == recipe.name) {
            e._id = id;
            break;
        }
    }
    sessionStorage.setItem("recipes", JSON.stringify(recipes));
}

export function cacheSetUnsaved(recipe) {
    // Get recipes
    let recipes = JSON.parse(sessionStorage.getItem("recipes"));
    // For each recipe
    for (let e of recipes) {
        // If recipe matches, delete _id property
        if (e.name == recipe.name) {
            delete e._id;
            break;
        }
    }
    // Set new recipes item
    sessionStorage.setItem("recipes", JSON.stringify(recipes));
}

export function cacheClearSavedAll(recipes) {
    // Update cache to reflect recipes being unsaved,
    // But keep them in the cache
    
    // Get recipes from cache
    let cachedRecipes = getCache().recipes;
    // Get array of recipe IDs from all up for deletion
    const recipeIds = recipes.map(recipe => recipe._id);
    // For each cachedRecipe,
    for (let rcp of cachedRecipes) {
        // If this recipe is up for deletion,
        if (rcp._id && recipeIds.includes(rcp._id)) {
            // Remove the ID from the cached recipe
            cacheSetUnsaved(rcp);
        }
    }
 }