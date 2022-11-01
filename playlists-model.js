const mongoose = require('mongoose');

var PlaylistSchema = new mongoose.Schema(
    {
        playlistDuration : String,
        listSongs : [
            { 
                _id : Number,
                dateAdd : {type : Date, default : Date.now}
            }
        ]
    }, {timestamps: true}
);

const Playlists = mongoose.model('Playlists', PlaylistSchema);

module.exports = Playlists;