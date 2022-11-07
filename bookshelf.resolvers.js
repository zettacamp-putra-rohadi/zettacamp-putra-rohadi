const bookShelfModel = require('./bookshelf-model');
const bookModel = require('./model');
const DataLoader = require('dataloader');
const mongoose = require('mongoose');

const bookLoader = new DataLoader(async (keys) => {
    const books = await bookModel.find({ _id: { $in: keys } });
    // console.log(keys,books);
    const bookMap = {};
    books.forEach((book) => {
        bookMap[book._id] = book;
    });
    // console.log("bookmap",bookMap);
    // console.log(keys.map((key) => bookMap[key]));
    return keys.map((key) => bookMap[key]);
});

const getOneBookshelf = async (_, { _id }) => {
    try {
        const bookshelf = await bookShelfModel.findById(_id);
        // console.log(bookshelf.book_ids.map((book) => book.book_id));
        return {
            ...bookshelf._doc,
            book_ids: bookshelf.book_ids.map((book) => {
                return {
                    ...book._doc,
                    book_id: bookLoader.load(book.book_id)
                };
            })
        }
    } catch (err) {
        throw err
    }
};

const getAllBookshelf = async () => {
    try {
        const bookshelf = await bookShelfModel.find({});
        return bookshelf;
    } catch (err) {
        throw err
    }
}

const getPlaylistCollaboratorLoader = async function (parent, args, context) {
    console.log(parent.book_id);
    if (parent.book_id) {
        return await bookLoader.loadMany(parent.book_id);
    }
};

module.exports={
    Query: {
        getOneBookshelf,
        getAllBookshelf
    },
    Book : {
        book_id: getPlaylistCollaboratorLoader
    }

}