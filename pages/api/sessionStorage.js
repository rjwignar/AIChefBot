
// Module for caching recipes in session storage
// a) User registers when they generate a recipe they like
// b) User navigates from page and wants to see the same recipes

export function setCache(recipes, messageHistory, selectedDiets) {
    sessionStorage.setItem("recipes", JSON.stringify(recipes));
    sessionStorage.setItem("selectedDiets", JSON.stringify(selectedDiets));
    sessionStorage.setItem("messageHistory", JSON.stringify(messageHistory));
}

export function getCache() {
    return [
        sessionStorage.getItem("recipes"),
        sessionStorage.getItem("selectedDiets"),
        sessionStorage.getItem("messageHistory")
    ]
}