const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
     {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
          anime: { type: mongoose.Schema.Types.ObjectId, ref: 'animes', required: true },
          title: { type: String, required: true },
          text: { type: String, required: true },
          date: { type: Date, default: Date.now },
          rating: { type: Number, min: 1, max: 10 }
     },
     {
          collection: 'comment'
     }
);

const Comment = mongoose.model('comments', commentSchema, 'comments');

module.exports = Comment;