
// Module for caching recipes in session storage
// a) User registers when they generate a recipe they like
// b) User navigates from page and wants to see the same recipes


// Array of JSON objects must be stringified
// selectedDiets is a string
export function setCache(recipes, messageHistory, selectedDiets) {
    sessionStorage.setItem("recipes", JSON.stringify(recipes));
    sessionStorage.setItem("messageHistory", JSON.stringify(messageHistory));
    sessionStorage.setItem("selectedDiets", selectedDiets);
}

// Array of JSON objects must be parsed
// selectedDiets is a string
export function getCache() {
    return {
        recipes: JSON.parse(sessionStorage.getItem("recipes")),
        messageHistory: JSON.parse(sessionStorage.getItem("messageHistory")),
        selectedDiets: sessionStorage.getItem("selectedDiets"),
    }
}