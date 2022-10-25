const mongoose = require("mongoose");

var BookshelfSchema = new mongoose.Schema(
  {
    shelf_name: String,
    book_id: [String],
  },
  { timestamps: true }
);

const Bookshelf = mongoose.model("bookshelf", BookshelfSchema, "Bookshelf");

module.exports = Bookshelf;
