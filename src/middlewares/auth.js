const User = require( "../api/models/user" );
const { verifyJwt } = require( "../config/jwt" );

const isAuth = async ( req, res, next ) => {
     try {
          const token = req.headers.authorization;
          const parsedToken = token.replace( "Bearer ", "" );

          const { id } = verifyJwt( parsedToken );

          const user = await User.findById( id );

          user.password = null;
          req.user = user;
          next();
     } catch ( error ) {
          return res.status( 401 ).json( "No estás autorizado" );
     }
};

const isAdmin = ( req, res, next ) => {
     if ( !req.user || req.user.rol !== 'admin' ) {
          return res.status( 403 ).json( { message: "Acceso denegado: requiere privilegios de administrador" } );
     }
     next();
};

module.exports = { isAuth, isAdmin };