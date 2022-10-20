let songs = [
  {
    id : 1,
    artist : "Neck Deep",
    name : "A part of me",
    genre : "Rock",
    duration : "09:09"
  },
  {
    id : 2,
    artist : "Neck Deep",
    name : "December",
    genre : "Rock",
    duration : "08:39"
  },
  {
    id : 3,
    artist : "Keane",
    name : "Somewhere only we know",
    genre : "Rock",
    duration : "07:29"
  },
  {
    id : 4,
    artist : "Keane",
    name : "Everybody's changing",
    genre : "Rock",
    duration : "08:38"
  },
  {
    id : 5,
    artist : "Bryan Adams",
    name : "I do it for you",
    genre : "Pop",
    duration : "09:59"
  },
  {
    id : 6,
    artist : "Bryan Adams",
    name : "Heaven",
    genre : "Pop",
    duration : "09:31"
  },
  {
    id : 7,
    artist : "Loues Armstrong",
    name : "What a wonderful world",
    genre : "Jazz",
    duration : "08:29"
  },
  {
    id : 8,
    artist : "Loues Armstrong",
    name : "Summertime",
    genre : "Jazz",
    duration : "09:29"
  },
  {
    id : 9,
    artist : "My Chemical Romance",
    name : "Cancer",
    genre : "Rock",
    duration : "09:51"
  },
  {
    id : 10,
    artist : "My Chemical Romance",
    name : "Disenchanted",
    genre : "Rock",
    duration : "09:57"
  },
  {
    id : 11,
    artist : "Paramore",
    name : "When It Rains",
    genre : "Pop",
    duration : "09:45"
  },
  {
    id : 12,
    artist : "Paramore",
    name : "Last Hope",
    genre : "Pop",
    duration : "08:45"
  },
  {
    id : 13,
    artist : "Blues Cousins",
    name : "The Shadow",
    genre : "Jazz",
    duration : "07:43"
  },
  {
    id : 14,
    artist : "Eddie Martin",
    name : "Autumn Blues",
    genre : "Jazz",
    duration : "08:20"
  },
  {
    id : 15,
    artist : "Rihanna",
    name : "Umbrella",
    genre : "Pop",
    duration : "08:45"
  },
];

//song based on artist
function songByArtist(artist, listSong){
  let lowerSong = lower(listSong);
  let lowerArtist = artist.toLowerCase();
  let result = lowerSong.filter(a => a.artist === lowerArtist);
    for (const a in result) {
      result[a].artist = result[0].artist.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
      result[a].name = result[0].name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
      result[a].genre = result[0].genre.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    }
  return (result) ;
};
//song based on genre
function songByGenre(genre,listSong){
  let lowerSong = lower(listSong);
  let lowerGenre = genre.toLowerCase();
  let result = lowerSong.filter(a => a.genre === lowerGenre);
    for (const a in result) {
      result[a].artist = result[0].artist.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
      result[a].name = result[0].name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
      result[a].genre = result[0].genre.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    }
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

function lower(obj) {
  for (var prop in obj) {
  if (typeof obj[prop] === 'string') {
    obj[prop] = obj[prop].toLowerCase();
  }
  if (typeof obj[prop] === 'object') {
    lower(obj[prop]);
    }
  }
  return obj;
}
// console.log("List Song Based On Artist\n",songByArtist("Keane",songs));
// console.log("List Song Based On Genre\n",songByGenre("Rock", songs));
// console.log(playlist(songs));

const bodyParser = require('body-parser');
const express = require('express')
const jwt = require("jsonwebtoken");

const app = express()
const port = 3000

app.use(bodyParser.json());

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