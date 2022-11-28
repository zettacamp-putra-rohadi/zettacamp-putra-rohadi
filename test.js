let listTransaction = [
  {
    _id: "638025e9840009468c0ee794",
    order_status: "SUCCESS",
    order_date: "25 November 2022",
    transaction_status: "ACTIVE",
    user_id: "63763c117b03e513acfa3918",
    menu: [
      {
        _id: "638025e9840009468c0ee795",
        recipe_id: "63772a8da4e92631b03758c7",
        amount: 2,
        note: "",
      },
      {
        _id: "63802039ee081105788145fa",
        recipe_id: "637c809bb2716001142279aa",
        amount: 3,
        note: "",
      },
    ],
    total_price: 3121,
    __v: 0,
  },
  {
    _id: "638025e9840009468c0ee794",
    order_status: "SUCCESS",
    order_date: "25 November 2022",
    transaction_status: "ACTIVE",
    user_id: "63763c117b03e513acfa3918",
    menu: [
      {
        _id: "638025e9840009468c0ee795",
        recipe_id: "638025bd840009468c0ee768",
        amount: 1,
        note: "",
      },
      {
        _id: "638025e9840009468c0ee795",
        recipe_id: "63772a8da4e92631b03758c7",
        amount: 2,
        note: "",
      },
      {
        _id: "63802039ee081105788145fa",
        recipe_id: "637c809bb2716001142279aa",
        amount: 3,
        note: "",
      },
    ],
    total_price: 3121,
    __v: 0,
  },

  {
    _id: "63802039ee081105788145f9",
    order_status: "SUCCESS",
    order_date: "25 November 2022",
    transaction_status: "ACTIVE",
    user_id: "63763fe0458a1834b44f0972",
    menu: [
      {
        _id: "63802039ee081105788145fa",
        recipe_id: "637c809bb2716001142279aa",
        amount: 3,
        note: "",
      },
      {
        _id: "638025e9840009468c0ee795",
        recipe_id: "63772a8da4e92631b03758c7",
        amount: 4,
        note: "",
      },
      {
        _id: "63802039ee081105788145fa",
        recipe_id: "637c809bb2716001142279ab",
        amount: 3,
        note: "",
      },
    ],
    total_price: 600000,
    __v: 0,
  },
  {
    _id: "63802039ee081105788145f9",
    order_status: "SUCCESS",
    order_date: "25 November 2022",
    transaction_status: "ACTIVE",
    user_id: "63763fe0458a1834b44f0972",
    menu: [
      {
        _id: "63802039ee081105788145fa",
        recipe_id: "637c809bb2716001142279ab",
        amount: 3,
        note: "",
      },
      {
        _id: "638025e9840009468c0ee795",
        recipe_id: "63772a8da4e92631b03758c7",
        amount: 4,
        note: "",
      },
      {
        _id: "63802039ee081105788145fa",
        recipe_id: "637c809bb2716001142279aa",
        amount: 3,
        note: "",
      },
    ],
    total_price: 600000,
    __v: 0,
  },
];

const listRecipe = [];

for (data of listTransaction) {
  for (menu of data.menu) {
    let check = true;
    for (recipe of listRecipe){
      if (recipe._id == menu.recipe_id){
        check = false;
        break;
      }
    }
    if (check){
      listRecipe.push({_id : menu.recipe_id});
    }
  }
}

let listRecipe2 = [
  {_id : "63772a8da4e92631b03758c7"},
  {_id : "637c809bb2716001142279ab"},
  {_id : "637c809bb2716001142279aa"},
  {_id : "637c809bb2716001142279ac"},
];

let amountOfEachRecipe = [];

for (recipe of listRecipe2){
  let amount = 0;
  for (data of listTransaction){
    for (menu of data.menu){
      if (recipe._id == menu.recipe_id){
        amount++;
      }
    }
  }
  amountOfEachRecipe.push({recipe_id : recipe._id, amount : amount});
}

console.log(amountOfEachRecipe);

amountOfEachRecipe.sort(function(a, b) {
  return b.amount - a.amount
})

console.log(amountOfEachRecipe.slice(0,3))
