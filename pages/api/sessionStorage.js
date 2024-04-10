
// Module for caching recipes in session storage
// a) User registers when they generate a recipe they like
// b) User navigates from page and wants to see the same recipes


// Array of JSON objects must be stringified
export function setCache(data) {
    sessionStorage.setItem("recipes", JSON.stringify(data.recipes));
    sessionStorage.setItem("messageHistory", JSON.stringify(data.messageHistory));
    // Which page were the recipes generated from?
    // If both are true, ingredients + diet
    // Otherwise, ingredients OR diet
    sessionStorage.setItem('selectedIngredients', data.selectedIngredients ? true : false);
    sessionStorage.setItem('selectedDiet', data.selectedDiet ? true : false);
}

// Array of JSON objects must be parsed
export function getCache() {
    return {
        recipes: JSON.parse(sessionStorage.getItem("recipes")),
        messageHistory: JSON.parse(sessionStorage.getItem("messageHistory")),
        selectedIngredients: JSON.parse(sessionStorage.getItem("selectedIngredients")),
        selectedDiet: JSON.parse(sessionStorage.getItem("selectedDiet")),
    }
}

export function updateRecipeId(recipe, id) {
    console.log("Updating cache...");
    let recipes = JSON.parse(sessionStorage.getItem("recipes"));
    for (let e of recipes) {
        if (e.name == recipe.name) {
            e._id = id;
            break;
        }
    }
    sessionStorage.setItem("recipes", JSON.stringify(recipes));
}

export function removeRecipeId(recipe) {
    console.log("Updating cache...");
    let recipes = JSON.parse(sessionStorage.getItem("recipes"));
    for (let e of recipes) {
        console.log(e);
        if (e.name == recipe.name) {
            delete e._id;
            break;
        }
    }
    sessionStorage.setItem("recipes", JSON.stringify(recipes));
}