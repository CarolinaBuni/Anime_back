
const { generateSign } = require( "../../config/jwt" );
const User = require( "../models/user" );
const bcrypt = require( 'bcrypt' );


//* GET User
const getUser = async ( req, res, next ) => {
     try {
          const user = await User.find().populate( 'favorites' ).populate( 'watchlist' );
          return res.status( 200 ).json( user );
     } catch ( error ) {
          return res.status( 400 ).json( "No se encuentra al usuario" );
     }
};


//* GET User by ID
const getUserByID = async ( req, res, next ) => {
     try {
          const { id } = req.params;
          const userById = await User.findById( id ).populate( 'favorites' ).populate( 'watchlist' );
          return res.status( 200 ).json( userById );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Error al recuperar usuario por ID" } );
     }
};

//* REGISTER

const register = async (req, res, next) => {
     try {
         const newUser = new User(req.body);
 
         const userDuplicated = await User.findOne({ email: req.body.email });
 
         if (userDuplicated) {
             return res.status(400).json({ message: "Este usuario ya existe" });
         }
 
         newUser.password = bcrypt.hashSync(req.body.password, 10); // Hash the password
 
         const userSaved = await newUser.save();
         const token = generateSign(userSaved.email, userSaved._id);
 
         return res.status(201).json({ user: userSaved, token });
     } catch (error) {
         return res.status(400).json({ message: "Error al registrarse", error: error.message });
     }
 };


//* LOGIN
const login = async ( req, res, next ) => {
     console.log( "Login Request Body:", req.body );  // Verifica que el email y password son correctos
     try {
          const user = await User.findOne( { email: req.body.email } );

          if ( user ) {
               console.log( "User found:", user );  // Log adicional para verificar el usuario encontrado
               if ( bcrypt.compareSync( req.body.password, user.password ) ) {
                    const token = generateSign( user.email, user._id );
                    return res.status( 200 ).json( { user, token } );
               } else {
                    return res.status( 400 ).json( "Usuario o contraseña erróneos" );
               }
          } else {
               return res.status( 400 ).json( "Usuario o contraseña no existe" );
          }
     } catch ( error ) {
          return res.status( 400 ).json( "Usuaro o contraseña incorrectas" );
     }
};

//* PUT User
const updateUser = async ( req, res, next ) => {
     try {
          const { id } = req.params;
          const { favorites, watchlist } = req.body;

          // Comprobación de autorización: solo el propio usuario puede actualizar su perfil
          if ( req.user._id.toString() !== id ) {
               return res.status( 403 ).json( { message: "Acceso denegado" } );
          }

          const user = await User.findById( id );
          console.log( "User before update:", user );

          if ( !user ) {
               return res.status( 404 ).json( { message: "Usuario no encontrado" } );
          }

          if ( favorites ) {
               user.favorites = favorites;
          }

          if ( watchlist ) {
               user.watchlist = watchlist;
          }

          await user.save();

          // Poblar después de guardar
          const populatedUser = await User.findById( user._id )
               .populate( 'favorites' )
               .populate( 'watchlist' );

          console.log( "User after update:", populatedUser );

          return res.status( 200 ).json( { message: "Usuario actualizado con éxito", user: populatedUser } );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Error al actualizar el usuario", error: error.message } );
     }
};


//* DELETE User
const deleteUser = async ( req, res, next ) => {
     try {
          const { id } = req.params;

          if ( req.user._id.toString() !== id && req.user.rol !== 'admin' ) {
               return res.status( 403 ).json( { message: "Acceso denegado" } );
          }

          const deletedUser = await User.findByIdAndDelete( id );

          if ( !deletedUser ) {
               return res.status( 404 ).json( { message: "Usuario no encontrado" } );
          }

          return res.status( 200 ).json( { message: "Usuario eliminado con éxito" } );
     } catch ( error ) {
          return res.status( 400 ).json( { message: "Error al eliminar el usuario", error: error.message } );
     }
};

module.exports = { register, login, getUser, getUserByID, updateUser, deleteUser };
