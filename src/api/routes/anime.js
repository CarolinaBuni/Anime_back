const { isAuth, isAdmin } = require( '../../middlewares/auth' );
const upload = require( '../../middlewares/file' );
const { getAnime, getAnimeByCriteria, postAnime, deleteAnime, putAnime } = require( '../controllers/anime' );

const animeRouter = require('express').Router();

animeRouter.get('/', getAnime);
animeRouter.get("/:criteria/:value/:condition?", getAnimeByCriteria);

animeRouter.post("/", [isAuth], [isAdmin], upload.single("image"), postAnime);
animeRouter.put("/:id", [isAuth], [isAdmin], upload.single("image"), putAnime)
animeRouter.delete("/:id", [isAuth], [isAdmin], deleteAnime);

module.exports = animeRouter;