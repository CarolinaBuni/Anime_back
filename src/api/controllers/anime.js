const { deleteFile } = require( "../../utils/deleteFile" );
const Anime = require( "../models/anime" );
const Comment = require( "../models/comment" );

//! GET anime
const getAnime = async ( req, res, next ) => {
     try {
          const animes = await Anime.find();
          return res.status( 201 ).json( animes );
     } catch ( error ) {
          return res.status( 400 ).json( "Fallo en la recuperación de los animes" );
     }
};

//! GET anime by various criteria
const getAnimeByCriteria = async ( req, res, next ) => {
     try {
          const { criteria, value, condition } = req.params;

          let query = {};

          switch ( criteria ) {
               case 'id':
                    query._id = value;
                    break;
               case 'title':
                    query.title = { $regex: new RegExp( value, "i" ) };
                    break;
               case 'genre':
                    query.genres = { $regex: new RegExp( value, "i" ) };
                    break;
               case 'status':
                    query.status = value;
                    break;
               case 'rating':
                    if ( !condition ) {
                         return res.status( 400 ).json( { message: "Condición de búsqueda inválida" } );
                    }
                    if ( condition === "gt" ) {
                         query.averageRating = { $gt: parseFloat( value ) };
                    } else if ( condition === "lt" ) {
                         query.averageRating = { $lt: parseFloat( value ) };
                    } else if ( condition === "gte" ) {
                         query.averageRating = { $gte: parseFloat( value ) };
                    } else {
                         return res.status( 400 ).json( { message: "Condición de búsqueda inválida" } );
                    }
                    break;
               case 'beforeYear':
                    query.releaseYear = { $lt: parseInt( value ) };
                    break;
               case 'afterYear':
                    query.releaseYear = { $gt: parseInt( value ) };
                    break;
               default:
                    return res.status( 400 ).json( { message: "Criterio de búsqueda inválido" } );
          }

          const animes = await Anime.find( query );
          if ( animes.length === 0 ) {
               return res.status( 404 ).json( { message: "No se encontraron animes con el criterio especificado" } );
          }

          if ( criteria === 'id' ) {
               // Obtener los comentarios relacionados con el anime
               const comments = await Comment.find( { anime: value } ).populate( "user", "userName email" );
               return res.status( 200 ).json( { anime: animes[ 0 ], comments } );
          } else {
               return res.status( 200 ).json( animes );
          }
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Fallo en la búsqueda por criterio", error: error.message } );
     }
};

//! POST anime
const postAnime = async ( req, res, next ) => {
     try {
          const genres = Array.isArray( req.body.genres )
               ? req.body.genres
               : req.body.genres.split( "," ).map( ( genre ) => genre.trim() );
          const newAnime = new Anime( {
               ...req.body,
               genres: genres,
               image: req.file ? req.file.path : null, 
          } );

          const anime = await newAnime.save();
          return res.status( 200 ).json( anime );
     } catch ( error ) {
          console.error("Error in postAnime:", error);
          return res.status( 400 ).json( { message: "Fallo en la creación del anime", error: error.message } );
     }
};

//! PUT anime
const putAnime = async ( req, res, next ) => {
     try {
          const { id } = req.params;
          const updateData = req.body;

          if ( req.file ) {
               const anime = await Anime.findById( id );
               if ( anime && anime.image ) {
                    await deleteFile( anime.image );
               }
               updateData.image = req.file.path; // Update with the new image path
          }

          const genres = Array.isArray( updateData.genres )
               ? updateData.genres
               : updateData.genres.split( "," ).map( ( genre ) => genre.trim() );
          updateData.genres = genres;

          const animeUpdated = await Anime.findByIdAndUpdate(
               id,
               { $set: updateData }, // Update only the provided fields
               { new: true, runValidators: true }
          );

          if ( !animeUpdated ) {
               return res.status( 404 ).json( { message: "Anime not found" } );
          }

          return res.status( 200 ).json( animeUpdated );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Failed to update anime", error: error.message } );
     }
};

//! DELETE anime
const deleteAnime = async ( req, res, next ) => {
     try {
          const { id } = req.params;
          const animeDeleted = await Anime.findByIdAndDelete( id );

          if ( !animeDeleted ) {
               return res.status( 404 ).json( { message: "Anime no encontrado" } );
          }

          // Si el anime tiene una imagen asociada, elimínala
          if ( animeDeleted.image ) {
               await deleteFile( animeDeleted.image );
          }

          return res.status( 200 ).json( { message: "Anime eliminado con éxito", animeDeleted } );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Fallo en la eliminación del anime", error: error.message } );
     }
};

module.exports = {
     getAnime,
     getAnimeByCriteria,
     // getAnimeByID,
     // getAnimeByTitle,
     // getAnimeByGenre,
     // getAnimeByStatus,
     // getAnimeByRating,
     // getAnimeBeforeYear,
     // getAnimeAfterYear,
     postAnime,
     putAnime,
     deleteAnime,
};
