// let listTransaction = [
//   {
//     _id: "638025e9840009468c0ee794",
//     order_status: "SUCCESS",
//     order_date: "25 November 2022",
//     transaction_status: "ACTIVE",
//     user_id: "63763c117b03e513acfa3918",
//     menu: [
//       {
//         _id: "638025e9840009468c0ee795",
//         recipe_id: "63772a8da4e92631b03758c7",
//         amount: 2,
//         note: "",
//       },
//       {
//         _id: "63802039ee081105788145fa",
//         recipe_id: "637c809bb2716001142279aa",
//         amount: 3,
//         note: "",
//       },
//     ],
//     total_price: 3121,
//     __v: 0,
//   },
//   {
//     _id: "638025e9840009468c0ee794",
//     order_status: "SUCCESS",
//     order_date: "25 November 2022",
//     transaction_status: "ACTIVE",
//     user_id: "63763c117b03e513acfa3918",
//     menu: [
//       {
//         _id: "638025e9840009468c0ee795",
//         recipe_id: "638025bd840009468c0ee768",
//         amount: 1,
//         note: "",
//       },
//       {
//         _id: "638025e9840009468c0ee795",
//         recipe_id: "63772a8da4e92631b03758c7",
//         amount: 2,
//         note: "",
//       },
//       {
//         _id: "63802039ee081105788145fa",
//         recipe_id: "637c809bb2716001142279aa",
//         amount: 3,
//         note: "",
//       },
//     ],
//     total_price: 3121,
//     __v: 0,
//   },

//   {
//     _id: "63802039ee081105788145f9",
//     order_status: "SUCCESS",
//     order_date: "25 November 2022",
//     transaction_status: "ACTIVE",
//     user_id: "63763fe0458a1834b44f0972",
//     menu: [
//       {
//         _id: "63802039ee081105788145fa",
//         recipe_id: "637c809bb2716001142279aa",
//         amount: 3,
//         note: "",
//       },
//       {
//         _id: "638025e9840009468c0ee795",
//         recipe_id: "63772a8da4e92631b03758c7",
//         amount: 4,
//         note: "",
//       },
//       {
//         _id: "63802039ee081105788145fa",
//         recipe_id: "637c809bb2716001142279ab",
//         amount: 3,
//         note: "",
//       },
//     ],
//     total_price: 600000,
//     __v: 0,
//   },
//   {
//     _id: "63802039ee081105788145f9",
//     order_status: "SUCCESS",
//     order_date: "25 November 2022",
//     transaction_status: "ACTIVE",
//     user_id: "63763fe0458a1834b44f0972",
//     menu: [
//       {
//         _id: "63802039ee081105788145fa",
//         recipe_id: "637c809bb2716001142279ab",
//         amount: 3,
//         note: "",
//       },
//       {
//         _id: "638025e9840009468c0ee795",
//         recipe_id: "63772a8da4e92631b03758c7",
//         amount: 4,
//         note: "",
//       },
//       {
//         _id: "63802039ee081105788145fa",
//         recipe_id: "637c809bb2716001142279aa",
//         amount: 3,
//         note: "",
//       },
//     ],
//     total_price: 600000,
//     __v: 0,
//   },
// ];

// const listRecipe = [];

// for (data of listTransaction) {
//   for (menu of data.menu) {
//     let check = true;
//     for (recipe of listRecipe){
//       if (recipe._id == menu.recipe_id){
//         check = false;
//         break;
//       }
//     }
//     if (check){
//       listRecipe.push({_id : menu.recipe_id});
//     }
//   }
// }

// let listRecipe2 = [
//   {_id : "63772a8da4e92631b03758c7"},
//   {_id : "637c809bb2716001142279ab"},
//   {_id : "637c809bb2716001142279aa"},
//   {_id : "637c809bb2716001142279ac"},
// ];

// let amountOfEachRecipe = [];

// for (recipe of listRecipe2){
//   let amount = 0;
//   for (data of listTransaction){
//     for (menu of data.menu){
//       if (recipe._id == menu.recipe_id){
//         amount++;
//       }
//     }
//   }
//   amountOfEachRecipe.push({recipe_id : recipe._id, amount : amount});
// }

// console.log(amountOfEachRecipe);

// amountOfEachRecipe.sort(function(a, b) {
//   return b.amount - a.amount
// })

// console.log(amountOfEachRecipe.slice(0,3))

const ingredients = [
  {
    _id: "638079ec2ef2685834468a4c",
    ingredient_status: "ACTIVE",
    name: "micin",
    stock: 100,
    unit: "gr",
    __v: 0,
    list_recipe : [ ]
  },

  {
    _id: "6374adcec9804139e8eef28f",
    ingredient_status: "ACTIVE",
    name: "merica",
    stock: 100,
    __v: 0,
    list_recipe : [ ]
  },

  {
    _id: "6374ac02c9804139e8eef284",
    ingredient_status: "ACTIVE",
    name: "garam",
    stock: 1,
    __v: 0,
    list_recipe : [ ]
  },

  {
    _id: "637494b6f497d608ccee2471",
    ingredient_status: "ACTIVE",
    name: "tomat",
    stock: 90,
    __v: 0,
    list_recipe : [ ]
  },

  {
    _id: "636b695c622b59340c100eaa",
    ingredient_status: "ACTIVE",
    name: "cabe",
    stock: 10,
    __v: 0,
    list_recipe : [ ]
  },
];

const recipes = [
  {
    _id: "6375e683366df22200ae01a1",
    name: "Barbeque Bakar Pedas",
    ingredients: [
      {
        _id: "63836f4c9b10133660d83767",
        ingredient_id: "6374adcec9804139e8eef28f",
        stock_used: 1,
      },
    ],
  },

  {
    _id: "63772a8da4e92631b03758c7",
    name: "Steak Original",
    ingredients: [
      {
        _id: "637d976f5e11a7129c7b66d7",
        ingredient_id: "6374ac02c9804139e8eef284",
        stock_used: 2,
      },
      {
        _id: "637d976f5e11a7129c7b66d8",
        ingredient_id: "6374adcec9804139e8eef28f",
        stock_used: 1,
      },
    ],
  },

  {
    _id: "637c809bb2716001142279aa",
    name: "Steak Bumbu Rendang",
    ingredients: [
      {
        _id: "637d975e5e11a7129c7b66c7",
        ingredient_id: "6374ac02c9804139e8eef284",
        stock_used: 1,
      },
      {
        _id: "637d975e5e11a7129c7b66c8",
        ingredient_id: "637494b6f497d608ccee2471",
        stock_used: 1,
      },
    ],
  },

  {
    _id: "63837a0eafb2432184e0526e",
    name: "Steak Wagyu A4",
    ingredients: [
      {
        _id: "63837bbd53e8530e144e87f4",
        ingredient_id: "6374adcec9804139e8eef28f",
        stock_used: 1,
      },
    ],
  },
];


for (const [index, ingredient] of ingredients.entries()) {
    console.log(index, ingredient._id);
    for (recipe of recipes) {
        for (recipeIngredient of recipe.ingredients) {
        if (ingredient._id.toString() === recipeIngredient.ingredient_id.toString()) {
            console.log("--",index, ingredient._id);
            ingredients[index].list_recipe.push(recipe.name);
        }
        }
    }
}

console.log(ingredients);
