const mongoose = require("mongoose");

var BookshelfSchema = new mongoose.Schema(
  {
    shelf_name: String,
    book_ids: [{book_id: mongoose.Types.ObjectId}, {added_date:{ type: Date, default: Date.now }}, {stock: Number}],
    datetime: [{date: String}, {time: String}]
  },
  { timestamps: true }
);

const Bookshelf = mongoose.model("bookshelf", BookshelfSchema, "Bookshelf");

module.exports = Bookshelf;

// mongoose.Schema.ObjectId
// mongoose.Types.ObjectId
