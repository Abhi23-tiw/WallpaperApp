const categories = [
    "backgrounds",
    "fashion",
    "nature",
    "science",
    "education",
    "feelings",
    "health",
    "people",
    "religion",
    "places",
    "animals",
    "industry",
    "computer",
    "food",
    "sports",
    "transportation",
    "travel",
    "buildings",
    "business",
    "music"
].map(category => category.charAt(0).toUpperCase() + category.slice(1));


const filters = {
    order: ["popular","latest"],
    orientation: [ "all", "horizontal", "vertical"],
    type: ["all", "photo", "illustration", "vector"],
    colors:["red", "orange", "yellow", "green", "turquoise", "blue", "pink", "gray", "black", "brown"]
}
export const data = {
    categories,
    filters
}