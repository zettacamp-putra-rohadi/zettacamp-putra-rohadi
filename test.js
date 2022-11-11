let data_array = [];

// our object
let my_object = {};

// load data into object

my_object.name = "stack";
my_object.age = 20;
my_object.hair_color = "red";
my_object.eye_color = "green";

// push the object to Array
data_array.push(my_object);

//result
// [ { name: 'stack', age: 20, hair_color: 'red', eye_color: 'green' } ]
const mongoose = require('mongoose');
let aggregate = [];
let query = {};
let match = {};
const recipe_name = "test";
// const test = new RegExp(recipe_name, 'i')
// query.recipe_status = {$ne: 'DELETED'};
// query.name = {test} ;
// query._id = mongoose.Types.ObjectId("5f9b1b1b1b1b1b1b1b1b1b1b");
    // aggregate.$match.push({recipe_status: {$ne: 'DELETED'}});
    // aggregate.$match.push({_id: mongoose.Types.ObjectId(_id)});

match.$match = {name: new RegExp(recipe_name, 'i')};
console.log(match);

// aggregate.$match.push({name: new RegExp(recipe_name, 'i')})
aggregate.push(match);

console.log(aggregate);