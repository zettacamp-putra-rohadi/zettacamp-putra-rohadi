const mongoose = require('mongoose');

var SongSchema = new mongoose.Schema(
    {
        _id : Number,
        artist : String,
        title : String,
        genre : String,
        duration : String
    }, {timestamps: true}
);

const Songs = mongoose.model('Songs', SongSchema);

module.exports = Songs;