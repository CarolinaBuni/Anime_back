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

//! GET anime by ID
const getAnimeByID = async ( req, res, next ) => {
     try {
          const { id } = req.params; // ID del anime
          const anime = await Anime.findById( id );
          if ( !anime ) {
               return res.status( 404 ).json( { message: "Anime no encontrado" } );
          }

          // Obtener los comentarios relacionados con el anime
          const comments = await Comment.find( { anime: id } ).populate( "user", "userName email" );

          // Devolver el anime con comentarios
          return res.status( 200 ).json( {
               anime,
               comments,
          } );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Error al recuperar el anime y sus comentarios", error: error.message } );
     }
};

//! GET anime by Title
const getAnimeByTitle = async ( req, res, next ) => {
     try {
          const { title } = req.params;
          const regex = new RegExp( title, "i" ); // 'i' para búsqueda insensible a mayúsculas/minúsculas
          const animesByTitle = await Anime.find( { title: { $regex: regex } } );
          if ( animesByTitle.length === 0 ) {
               return res.status( 404 ).json( { message: "No se encontraron animes con ese título" } );
          }
          return res.status( 200 ).json( animesByTitle );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Fallo en la búsqueda por título", error: error.message } );
     }
};

//! GET anime by GENRE
const getAnimeByGenre = async ( req, res, next ) => {
     try {
          const { genre } = req.params;
          const regex = new RegExp( genre, "i" );
          const animesByGenre = await Anime.find( { genres: { $regex: regex } } );
          if ( animesByGenre.length === 0 ) {
               return res.status( 404 ).json( { message: "No se encontraron animes para el género proporcionado" } );
          }
          return res.status( 200 ).json( animesByGenre );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Fallo en la búsqueda por género", error: error.message } );
     }
};

//! GET anime by STATUS
const getAnimeByStatus = async ( req, res, next ) => {
     try {
          const { status } = req.params;
          const animeByStatus = await Anime.find( { status: status } );
          if ( animeByStatus.length === 0 ) {
               return res.status( 404 ).json( { message: "No se encontraron animes con el estado proporcionado" } );
          }
          return res.status( 200 ).json( animeByStatus );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Fallo en la búsqueda por status", error: error.message } );
     }
};

//! GET anime by Average RATING
const getAnimeByRating = async ( req, res, next ) => {
     try {
          const { rating, condition } = req.params;
          let query = {};
          if ( condition === "gt" ) {
               query.averageRating = { $gt: parseFloat( rating ) };
          } else if ( condition === "lt" ) {
               query.averageRating = { $lt: parseFloat( rating ) };
          } else if ( condition === "gte" ) {
               query.averageRating = { $gte: parseFloat( rating ) };
          } else {
               return res.status( 400 ).json( { message: "Condición de búsqueda inválida" } );
          }

          const animeByRating = await Anime.find( query );
          if ( animeByRating.length === 0 ) {
               return res.status( 404 ).json( { message: "No se encontraron animes con el criterio especificado" } );
          }
          return res.status( 200 ).json( animeByRating );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Fallo en la búsqueda por calificación promedio", error: error.message } );
     }
};

//! GET animes before YEAR
const getAnimeBeforeYear = async ( req, res, next ) => {
     try {
          const { year } = req.params;
          const animes = await Anime.find( { releaseYear: { $lt: parseInt( year ) } } );
          if ( animes.length === 0 ) {
               return res.status( 404 ).json( { message: "No se encontraron animes antes del año " + year } );
          }
          return res.status( 200 ).json( animes );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Fallo en la búsqueda por año de lanzamiento", error: error.message } );
     }
};

//! GET animes after YEAR
const getAnimeAfterYear = async ( req, res, next ) => {
     try {
          const { year } = req.params;
          const animes = await Anime.find( { releaseYear: { $gt: parseInt( year ) } } );
          if ( animes.length === 0 ) {
               return res.status( 404 ).json( { message: "No se encontraron animes después del año " + year } );
          }
          return res.status( 200 ).json( animes );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Fallo en la búsqueda por año de lanzamiento", error: error.message } );
     }
};

//! POST anime
const postAnime = async ( req, res, next ) => {
     try {
          // Construir el nuevo anime con la información del cuerpo de la solicitud
          const genres = Array.isArray( req.body.genres )
               ? req.body.genres
               : req.body.genres.split( "," ).map( ( genre ) => genre.trim() );
          const newAnime = new Anime( {
               ...req.body,
               genres: genres,
               image: req.file ? req.file.path : null, // Guarda la URL de la imagen si existe
          } );

          const anime = await newAnime.save();
          return res.status( 200 ).json( anime );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Fallo en la creación del anime", error: error.message } );
     }
};

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
     getAnimeByID,
     getAnimeByTitle,
     getAnimeByGenre,
     getAnimeByStatus,
     getAnimeByRating,
     getAnimeBeforeYear,
     getAnimeAfterYear,
     postAnime,
     putAnime,
     deleteAnime,
};
