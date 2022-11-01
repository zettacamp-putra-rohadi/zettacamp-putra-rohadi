const bodyParser = require('body-parser');
const express = require('express')
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const songsModel = require('./songs-model');
const playlistsModel = require('./playlists-model');

const app = express();
const port = 3000;
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/zettacamp');

//song based on artist
function songByArtist(artist, listSong){
  let result = listSong.filter(a => a.artist === artist);
  return (result) ;
};
//song based on genre
function songByGenre(genre,listSong){
  let result = listSong.filter(a => a.genre === genre);
  return (result);
};

//list of songs with a total duration of less than 1 hour and random title
function playlist(playlistSong, duration){
  let time = 0;
  let playlist = [];
  console.log(playlistSong);
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

function generateAccessToken(payload) {
  return jwt.sign(payload, 'secret', { expiresIn: '1h' });
}

app.post('/api/maketoken', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const token = generateAccessToken({ username: username, password: password });
  const result = { token: token };
  res.send(result);
})

function jwtAuth(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth.split(' ')[1];

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.send({ message: 'Username atau Password anda salah!' });
    next()
  })
}

//get all songs
app.get('/api/songs', jwtAuth, async(req, res) => {
  const getpage = +req.query.page;
  if (getpage < 0){
    res.send({ message: 'Page tidak boleh kurang dari 1' });
  }
  const limit = +req.query.limit;
  const page = limit * getpage ;
  const sort = +req.query.sort;  
  const result = await songsModel.aggregate([
    {$sort : {title : sort} },
    {$match : {genre : "Jazz"}},
    {
      $facet : {
        "data" : [
          {$skip: page},
          {$limit: limit},
          {$project : {__v : 0}},
        ],
        "pageInfo" : [
          {
            $group : {
              _id : null,
              totalData : {$sum : 1},
            }
          },
          { $project : {_id : 0}}
        ]
      }
    }
  ]);
  try{
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
})


// get songs by artist
app.get('/api/songbyartist', jwtAuth, async (req, res) => {
  const getpage = +req.query.page;
  if (getpage <= 0){
    res.send({ message: 'Page tidak boleh kurang dari 1' });
  }
  const limit = +req.query.limit;
  const artist = req.query.artist;
  const page = limit * (getpage - 1);
  const result = await songsModel.aggregate([
    {$sort : {_id : -1} },
    {$match : {artist : artist}},
    {
      $facet : {
        "data" : [
          {$skip: page},
          {$limit: limit},
          {$project : {__v : 0}},
        ],
        "pageInfo" : [
          {
            $group : {
              _id : null,
              totalData : {$sum : 1},
            }
          },
          { $project : {_id : 0}}
        ]
      }
    }
  ]);
  try{
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
})

// insert song
app.post('/api/insertsong', jwtAuth, async (req,res) => {
  try {
    await songsModel.insertMany(req.body);
    res.send("Song has been added");
  } catch (err) {
    res.status(500).send(err);
  }
});

// update song
app.patch('/api/updatesong', jwtAuth, async (req, res) => {
  const id = req.query._id;
  const data = req.body;
  try {
    const updateSong = await songsModel.findByIdAndUpdate(id, data, {new: true});
    const result = { message : "Song has been updated", data : updateSong};
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

//delete song
app.delete('/api/deletesong', jwtAuth, async (req,res) => {
  try {
    const deleteSong = await songsModel.findByIdAndDelete(req.query.id);
    const result = { message : "Song has been deleted", data : deleteSong};
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get playlist 
app.get('/api/getplaylists', jwtAuth, async (req, res) => {
  const getpage = +req.query.page;
  if (getpage <= 0){
    res.send({ message: 'Page tidak boleh kurang dari 1' });
  }
  const limit = +req.query.limit;
  const page = limit * (getpage - 1);
  const result = await playlistsModel.aggregate([
    {$sort : {_id : -1} },
    {
      $lookup : {
          from : "songs",
          localField : "listSongs._id",
          foreignField : "_id",
          as : "listSong"
      }
    },
    {
      $match : {"listSong.genre" : "Rock"}
    },
    { $project : {listSongs : 0}},
    {
      $facet : {
        "data" : [
          {$skip: page},
          {$limit: limit},
        ],
        "pageInfo" : [
          {
            $group : {
              _id : null,
              totalData : {$sum : 1},
            }
          },
          { $project : {_id : 0}}
        ]
      }
    }
  ]);
  try{
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

//insert playlist
app.post('/api/insertplaylist', jwtAuth, async (req, res) => {
  try {
    const newPlaylist = new playlistsModel(req.body);
    await newPlaylist.save();
    res.send("Playlist has been added");
  } catch (err) {
    res.status(500).send(err);
  }
});

//create playlist random
app.get('/api/createplaylistrandom', jwtAuth, async (req,res) =>{
  const duration = req.query.duration;
  try{
    const getdata = await songsModel.find();
    const createPlaylist = playlist(getdata, duration);
    const newPlaylist = new playlistsModel(createPlaylist);
    await newPlaylist.save();
    const result = { message : "Playlist has been created", data : createPlaylist};
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
})

//update playlist
app.patch('/api/updateplaylist', jwtAuth, async (req, res) => {
  const id = req.query.id;
  const data = req.body;
  try {
    const updatePlaylist = await playlistsModel.findByIdAndUpdate(id, data, {new: true});
    const result = { message : "Playlist has been updated", data : updatePlaylist};
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

//add new song to playlist
app.patch('/api/addsongtoplaylist', jwtAuth, async (req, res) => {
  const id = req.query.id;
  const data = req.body;
  try {
    const updatePlaylist = await playlistsModel.updateMany({_id: id}, {$push: {"listSongs": data}}, {new: true});
    const result = { message : "Song has been added to playlist", data : updatePlaylist};
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

//delete playlist
app.delete('/api/deleteplaylist', jwtAuth, async (req, res) => {
  try {
    const deletePlaylist = await playlistsModel.findByIdAndDelete(req.query.id);
    const result = { message : "Playlist has been deleted", data : deletePlaylist};
    res.send(result);
  } catch (err){
    res.status(500).send(err);
  }
})

// app.get('/api/songbyartist', jwtAuth, (req, res) => {
//   const artist = req.query.artist;
//   const playlist = songByArtist(artist, songs);
//   res.send(playlist);
// })

app.get('/api/songbygenre',jwtAuth, async (req, res) => {
  const genre = req.query.genre;
  const getdata = await songsModel.find();
  const result = songByGenre(genre, getdata);
  res.send(result);
})

app.get('/api/playlist',jwtAuth, (req,res) => {
  const result = playlist(songs);
  res.send(result);
})


app.listen(port);