const DataLoader = require('dataloader');
const SongsModel = require('../song/song.model');

const playlistLoader = new DataLoader(async (keys) => {
    const songs = await SongsModel.find({_id: {$in: keys}});
    const songsMap = {};
    songs.forEach(song => {
        songsMap[song._id] = song;
    });
    return keys.map(key => songsMap[key]);
});

module.exports = playlistLoader;