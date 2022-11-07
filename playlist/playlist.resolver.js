const playlistModel = require('./playlist.model');
const songModel = require('../song/song.model');
const mongoose = require('mongoose');
const { aggregate } = require('./playlist.model');

const insertPlaylist = async function (parent, {playlist_input}, context){
    const newPlaylist = new playlistModel({
        playlistDuration : playlist_input.playlistDuration,
        listSongs : playlist_input.listSongs
    });
    const result = await newPlaylist.save();
    return result;
}

const insertSong = async function (parent, {playlist_input}, context){
    const playlist = await playlistModel.findById(playlist_input.playlist_id);
    if(!playlist){
        throw new Error('Playlist not found');
    }
    playlist.listSongs.push({
        _id: playlist_input.song_id
    });
    const result = await playlist.save();
    return result;
}

const deleteSongPlaylist = async function (parent, {playlist_input}, context){
    const playlist = await playlistModel.findById(playlist_input.playlist_id);
    if(!playlist){
        throw new Error('Playlist not found');
    }
    playlist.listSongs.pull({
        _id: playlist_input.song_id
    });
    const result = await playlist.save();
    return result;
}

const getAllPlaylist = async function (parent, {page, limit}, context){
    let aggregate = []
    aggregate.push({ $match : { _id : { $ne : null } } })
    if(!page && !limit){
        console.log('ga ada page dan limit');
        const playlists = await playlistModel.aggregate(aggregate);
        const count = await playlistModel.countDocuments();
        const result = playlists.map((playlist) => {
            return {
                ...playlist,
                count: count
            }
        });
        return result;
    } else{
        console.log('ada page dan limit');
        const skip = page * limit;
        const playlists = await playlistModel.aggregate([
            {$skip: skip},
            {$limit: limit}
            ]);
        const count = await playlistModel.countDocuments();
        const result = playlists.map((playlist) => {
            return {
                ...playlist,
                count: count
            }
        });
        return result;
    }
}

const getPlaylistLoader = async function (parent, args, context) {
    if (parent._id) {
        return await context.playlistLoader.load(parent._id);
    }
};

const getOnePlaylist = async function (parent, {playlist_id}, context){
    const playlist = await playlistModel.findById(playlist_id);
    return playlist;
}

const createPlaylistRandom = async function (parent, {duration}, context){
    const getdata = await songModel.find();
    const createPlaylist = playlist(getdata, duration);
    const newPlaylist = new playlistModel(createPlaylist);
    await newPlaylist.save();
    return createPlaylist;
}

function playlist(playlistSong, duration){
    let time = 0;
    let playlist = [];
    let maxDuration = convertDurationToSeconds(duration);
    for (let i = 0; i < playlistSong.length; i ++) {
      const random = Math.floor(Math.random() * playlistSong.length);
      let temp = playlist.some(a => a.id === playlistSong[random]._id);  
      if (temp == false) {
        time += convertDurationToSeconds(playlistSong[random].duration);
        if (time <= maxDuration) {
          playlist.push({"_id":playlistSong[random]._id});
        } else {
          time -= convertDurationToSeconds(playlistSong[random].duration);
        }
      } 
    }
    const finaltime = ~~(time / 60) + ':' + ((time % 60) < 10 ? "0" : "") + (time % 60);
    const finalPlaylist = {"playlistDuration":finaltime, "listSongs":playlist};
    return finalPlaylist;
};

function convertDurationToSeconds(duration) {
    return duration.split(":").reduce((prev, next) => (60 * prev) + +next);
};


module.exports = {
    Query : {
        getAllPlaylist,
        getOnePlaylist,
        createPlaylistRandom,
    },
    Mutation : {
        insertPlaylist,
        insertSong,
        deleteSongPlaylist
    },
    SongData : {
        _id: getPlaylistLoader
    }
}