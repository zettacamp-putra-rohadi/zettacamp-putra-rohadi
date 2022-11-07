const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
scalar Date

    type Playlist{
        _id: ID
        playlistDuration : String,
        listSongs : [SongData],
        count: Int
        createdAt: Date,
        updatedAt: Date
    }

    type SongData{
        _id: SongList
        dateAdd: Date
    }

    input PlaylistInput{
        playlistDuration : String,
        listSongs : [ID]
    }

    input PlaylistSongInput{
        playlist_id: ID
        song_id: ID
    }

    extend type Mutation{
        insertPlaylist(playlist_input: PlaylistInput): Playlist
        insertSong(playlist_input: PlaylistSongInput): Playlist
        deleteSongPlaylist(playlist_input: PlaylistSongInput): Playlist
    }
    
    extend type Query{
        getAllPlaylist(page : Int, limit: Int): [Playlist]
        getOnePlaylist(playlist_id: ID): Playlist
        createPlaylistRandom(duration: String): Playlist
    }
`;

module.exports = typeDefs;

// type SongList{
//     _id: ID
//     artist : String,
//     title : String,
//     genre : String,
//     duration : String
// }