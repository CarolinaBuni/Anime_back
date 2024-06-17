const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
     {
          userName: { type: String },
          email: { type: String, required: true },
          password: { type: String, required: true },
          avatar: { type: String },
          rol: { type: String, enum: [ 'user', 'admin' ], default: 'user' },
          favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'animes' }],
          watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'animes' }],
     },
     {
          timestamps: true,
          collection: 'user'
     }
);

userSchema.pre("save", function (next) {
     // Solo hashear la contraseña si ha sido modificada (o es nueva)
     if (!this.isModified('password')) {
         return next();
     }
     // Generar un salt y usarlo para hashear la contraseña
     this.password = bcrypt.hashSync(this.password, 10);
     next();
 });

const User = mongoose.model('users', userSchema, 'users');

module.exports = User;