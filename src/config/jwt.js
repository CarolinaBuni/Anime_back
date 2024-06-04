const jwt = require('jsonwebtoken');

//* Crear una llave
const generateSign = (userName, id) => {
     return jwt.sign({ userName, id }, process.env.JWT_SECRET, { expiresIn: "9y" });
};

//* Comprobar validez de la llave
const verifyJwt = (token) => {
     return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateSign, verifyJwt };