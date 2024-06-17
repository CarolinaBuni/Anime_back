const animeRouter = require( './anime' );
const commentRouter = require( './comment' );
const userRouter = require( './user' );

const mainRouter = require('express').Router();

mainRouter.use("/animes", animeRouter);
mainRouter.use("/users", userRouter);
mainRouter.use("/comments", commentRouter);

module.exports = mainRouter;