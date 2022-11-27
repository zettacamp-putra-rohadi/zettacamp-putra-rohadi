let listRecipe = [
  {
    _id: "636db322d912580e84cc209f",
    name: "nasi",
    recipe_status: "ACTIVE",
    ingredients: [
      {
        ingredient_id: {
          name: "cabe",
          stock: 868,
        },
        stock_used: 2,
      },
      {
        ingredient_id: {
          name: "bawang",
          stock: 820,
        },
        stock_used: 5,
      },
    ],
  },
  {
    _id: "6370ddc1ff93265aa4639079",
    name: "goyeng",
    recipe_status: "ACTIVE",
    ingredients: [
      {
        ingredient_id: {
          name: "cabe",
          stock: 868,
        },
        stock_used: 10,
      },
      {
        ingredient_id: {
          name: "bawang",
          stock: 820,
        },
        stock_used: 7,
      },
    ],
  },
];

let hitungAvailableStock = [];
listRecipe.forEach((recipe) => {
  var prevCalculate = 0;
  recipe.ingredients.forEach((ingredient) => {
    var calculateStock = Math.floor(
      (ingredient.ingredient_id.stock /= ingredient.stock_used)
    );
    if (prevCalculate !== 0) {
      if (calculateStock < prevCalculate) {
        prevCalculate = calculateStock;
      }
    } else {
      prevCalculate = calculateStock;
    }
  });
  hitungAvailableStock.push({ recipeId: recipe._id, stock_terkecil: prevCalculate });
  recipe.availableStock = prevCalculate;
});

console.log(hitungAvailableStock, listRecipe);
