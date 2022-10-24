const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const bookPurchase = require('./script.js');

const app = express();
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/books');
var query = 'mongodb://localhost:27017/books'
 
const db = (query);
mongoose.Promise = global.Promise;
 
mongoose.connect(db, { useNewUrlParser : true,
useUnifiedTopology: true }, function(error) {
    if (error) {
        console.log("Error!" + error);
    }
});
 
module.exports = router;

app.use(bookPurchase);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
