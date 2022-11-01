const bodyParser = require('body-parser');
const express = require('express')
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(bodyParser.json());

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
function playlist(playlistSong){
  let time = 0;
  let playlist = [];
  for (let i = 0; i < playlistSong.length; i ++) {
    const random = Math.floor(Math.random() * playlistSong.length);
    let temp = playlist.some(a => a.id === playlistSong[random].id);  
    if (temp == false) {
      time += convertDurationToSeconds(playlistSong[random].duration);
      if (time <= 3600) {
        playlist.push(playlistSong[random]);
      } else {
        time -= convertDurationToSeconds(playlistSong[random].duration);
      }
    } 
  }
  const finaltime = ~~(time / 60) + ':' + ((time % 60) < 10 ? "0" : "") + (time % 60);
  const finalPlaylist = [{"Playlist Duration":finaltime, "List Songs":playlist}];
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

app.get('/api/songbyartist', jwtAuth, (req, res) => {
  const artist = req.query.artist;
  const playlist = songByArtist(artist, songs);
  res.send(playlist);
})

app.get('/api/songbygenre',jwtAuth, (req, res) => {
  const genre = req.query.genre;
  const result = songByGenre(genre, songs);
  res.send(result);
})

app.get('/api/playlist',jwtAuth, (req,res) => {
  const result = playlist(songs);
  res.send(result);
})


app.listen(port);