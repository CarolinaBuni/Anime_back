const Comment = require( "../models/comment" );

//? GET Comment
const getComment = async ( req, res, next ) => {
     try {
          const comment = await Comment.find().populate( 'user' ).populate( 'anime' );
          return res.status( 200 ).json( comment );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Error al recuperar el comentario", error: error.message } );
     }
};

//? POST Comment
const postComment = async ( req, res, next ) => {
     try {
          const { anime, title, text, rating } = req.body;
          const userId = req.user._id;

          // Crea el comentario
          const newComment = new Comment( {
               user: userId,  
               anime: anime,  
               title: title, 
               text: text,   
               rating: rating 
          } );


          await newComment.save();
          const populatedComment = await Comment.findById( newComment._id )
               .populate( 'user' )
               .populate( 'anime' );

          // Devuelve la respuesta
          return res.status( 201 ).json( { message: "Comentario creado exitosamente", comment: populatedComment } );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Error al crear el comentario", error: error.message } );
     }
};


//? UPDATE Comment
const updateComment = async ( req, res, next ) => {
     try {
          const { id } = req.params;
          const { title, text, rating } = req.body;

          // Buscar el comentario por ID
          const comment = await Comment.findById( id );

          // Verificar si el comentario existe
          if ( !comment ) {
               return res.status( 404 ).json( { message: "Comentario no encontrado" } );
          }

          // Verificar si el usuario actual es el autor del comentario
          if ( comment.user.toString() !== req.user._id.toString() ) {
               return res.status( 403 ).json( { message: "No autorizado para actualizar este comentario" } );
          }

          // Actualizar el comentario con los nuevos datos
          if (title) comment.title = title;
          if ( text ) comment.text = text;
          if ( rating ) comment.rating = rating;

          await comment.save();

          return res.status( 200 ).json( { message: "Comentario actualizado con éxito", comment } );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Error al actualizar el comentario", error: error.message } );
     }
};


//? DELETE Comment
const deleteComment = async ( req, res, next ) => {
     try {
          const { id } = req.params;

          // Primero, encontrar el comentario para verificar la autorización
          const comment = await Comment.findById( id );
          if ( !comment ) {
               return res.status( 404 ).json( { message: "Comentario no encontrado" } );
          }

          // Verificar si el usuario es el autor del comentario o un administrador
          if ( comment.user.toString() !== req.user._id.toString() && req.user.rol !== 'admin' ) {
               return res.status( 403 ).json( { message: "No autorizado para eliminar este comentario" } );
          }

          // Si la verificación es exitosa, proceder a eliminar el comentario
          await Comment.findByIdAndDelete( id );
          return res.status( 200 ).json( { message: "Comentario eliminado exitosamente" } );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Error al eliminar el comentario", error: error.message } );
     }
};


module.exports = { getComment, postComment, updateComment, deleteComment };