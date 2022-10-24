var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    date_published: Date,
    price: Number,
},{ timestamps: true });

const Book = mongoose.model('book', BookSchema, 'Books');

module.exports = Book;