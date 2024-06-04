const mongoose = require( 'mongoose' );

const animeSchema = new mongoose.Schema(
     {
          title: { type: String, required: true },
          synopsis: { type: String, required: true },
          genres: {
               type: [String], 
               required: true, 
               enum: [ 'Action', 'Adventure', 'Science Fiction', 'Comedy', 'Drama', 'Slice of Life', 'Fantasy', 'Gore', 'Magic', 'Supernatural', 'Horror', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi', 'Sports', 'Military', 'Historical', 'Thriller', 'Ecchi', 'Harem', 'Reverse Harem', 'Yaoi', 'Yuri', 'Moe', 'Shounen', 'Shoujo', 'Iyashikei', 'Seinen', 'Josei', 'Isekai', 'Magical Girl', 'Mecha', 'Cyberpunk', 'Space Opera', 'Martial Arts', 'Baseball', 'Soccer' ]
          },
          episodes: { type: Number, required: true },
          status: { type: String, 
               required: true, 
               enum: [ 'Airing', 'Completed', 'Upcoming' ] },
          image: { type: String, required: true },
          averageRating: { type: Number, required: true },
          releaseYear: { type: Number, required: true }

     },
     {
          timestamps: true,
          collection: 'anime'
     }
);

const Anime = mongoose.model( 'animes', animeSchema, 'animes' );
module.exports = Anime;