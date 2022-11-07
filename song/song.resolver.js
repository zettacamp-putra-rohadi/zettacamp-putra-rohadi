const SongModel = require('./song.model');
const mongoose = require('mongoose');

const insertSongList = async function (parent, {song_input}, context){
    const newSong = new SongModel({
        artist: song_input.artist,
        title: song_input.title,
        genre: song_input.genre,
        duration: song_input.duration
    });
    const result = await newSong.save();
    return result;
;}

const updateSong = async function (parent, {song_input}, context){
    const song = await SongModel.findById(song_input.song_id);
    if(!song){
        throw new Error('Song not found');
    }
    song.artist = song_input.artist;
    song.title = song_input.title;
    song.genre = song_input.genre;
    song.duration = song_input.duration;
    const result = await song.save();
    return result;
};

const deleteSong = async function (parent, {song_input}, context){
    const song = await SongModel.findById(song_input.song_id);
    if(!song){
        throw new Error('Song not found');
    }
    const result = await song.remove();
    return result;
};

const getAllSongs = async function (parent, {page, limit}, context){
    if(!page || !limit){
        const songs = await SongModel.find();
        const count = await SongModel.countDocuments();
        return {
            songs: songs,
            count: count
        }
    } else{
        const skip = page * limit;
        const songs = await SongModel.aggregate([
            {$skip: skip},
            {$limit: limit}
            ]);
        const count = await SongModel.countDocuments();
        return {
            songs: songs,
            count: count
        }
    }
};

const getSongByArtist = async function (parent, {song_input}, context){
    const song = await SongModel.find({artist: song_input.artist});
    if(!song){
        throw new Error('Song not found');
    }
    return song;
};

const getSongByGenre = async function (parent, {song_input}, context){
    const song = await SongModel.find({genre: song_input.genre});
    if(!song){
        throw new Error('Song not found');
    }
    return song;
};

module.exports = {
    Query : {
        getAllSongs,
        getSongByArtist,
        getSongByGenre
    },
    Mutation : {
        insertSongList,
        updateSong,
        deleteSong
    }
};