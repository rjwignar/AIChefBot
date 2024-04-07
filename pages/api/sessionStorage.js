
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
        selectedIngredients: JSON.parse(sessionStorage.getItem("selectedDiet")),
        selectedDiet: JSON.parse(sessionStorage.getItem("selectedDiet")),
    }
}