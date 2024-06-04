const { isAuth } = require( '../../middlewares/auth' );
const { postComment, getComment, deleteComment, updateComment } = require( '../controllers/comment' );

const commentRouter = require('express').Router();

commentRouter.get("/", getComment);
commentRouter.post("/", [isAuth], postComment);
commentRouter.put("/:id", [isAuth], updateComment);
commentRouter.delete("/:id", [isAuth], deleteComment);

module.exports = commentRouter;