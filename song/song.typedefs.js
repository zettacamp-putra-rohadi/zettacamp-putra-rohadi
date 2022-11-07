const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
scalar Date

    type SongList{
        _id: ID
        artist : String,
        title : String,
        genre : String,
        duration : String
        createdAt: Date
        updatedAt: Date
    }

    type AllSongList{
        songs: [SongList]
        count: Int
    }

    input SongListInput{
        artist : String,
        title : String,
        genre : String,
        duration : String
    }

    input SongListEditInput{
        song_id: ID
        artist : String,
        title : String,
        genre : String,
        duration : String
    }

    input SongListDeleteInput{
        song_id: ID
    }

    extend type Mutation{
        insertSongList(songlist_input: SongListInput) : SongList
        updateSong(songlist_input: SongListEditInput) : SongList
        deleteSong(songlist_input: SongListDeleteInput): SongList
    }
    
    extend type Query{
        getAllSongs(page : Int, limit: Int): AllSongList
        getSongByArtist(artist: String): [SongList]
        getSongByGenre(genre: String): [SongList]
    }
`;

module.exports = typeDefs;