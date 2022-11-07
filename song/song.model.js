const mongoose = require('mongoose');

var SongSchema = new mongoose.Schema(
    {
        artist : String,
        title : String,
        genre : String,
        duration : String
    }, {timestamps: true}
);

const Songs = mongoose.model('songs', SongSchema);

module.exports = Songs;