let songs = [
  {
    id : 1,
    artist : "Neck Deep",
    name : "A part of me",
    genre : "Rock",
    duration : "13:09"
  },
  {
    id : 2,
    artist : "Neck Deep",
    name : "December",
    genre : "Rock",
    duration : "13:39"
  },
  {
    id : 3,
    artist : "Keane",
    name : "Somewhere only we know",
    genre : "Rock",
    duration : "13:39"
  },
  {
    id : 4,
    artist : "Keane",
    name : "Everybody's changing",
    genre : "Rock",
    duration : "13:38"
  },
  {
    id : 5,
    artist : "Bryan Adams",
    name : "I do it for you",
    genre : "Pop",
    duration : "16:33"
  },
  {
    id : 6,
    artist : "Bryan Adams",
    name : "Heaven",
    genre : "Pop",
    duration : "14:31"
  },
  {
    id : 7,
    artist : "Loues Armstrong",
    name : "What a wonderful world",
    genre : "Jazz",
    duration : "12:29"
  },
  {
    id : 8,
    artist : "Loues Armstrong",
    name : "Summertime",
    genre : "Jazz",
    duration : "13:29"
  },
  {
    id : 9,
    artist : "My Chemical Romance",
    name : "Cancer",
    genre : "Rock",
    duration : "12:51"
  },
  {
    id : 10,
    artist : "My Chemical Romance",
    name : "Disenchanted",
    genre : "Rock",
    duration : "14:57"
  },
];

//song based on artist
function songByArtist(artist,playlist){
  return playlist.filter(a => a.artist === artist) ;
};

//song based on genre
function songByGenre(genre,playlist){
  return playlist.filter(a => a.genre === genre);
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
  console.log("Playlist duration :",time,"Seconds");
  return playlist;
};

function convertDurationToSeconds(duration) {
  return duration.split(":").reduce((prev, next) => (60 * prev) + +next);
};

console.log("List Song Based On Artist\n",songByArtist("Keane",songs));
console.log("List Song Based On Genre\n",songByGenre("Rock", songs));
console.log(playlist(songs));