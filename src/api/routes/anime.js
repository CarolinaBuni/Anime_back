const { isAuth, isAdmin } = require( '../../middlewares/auth' );
const upload = require( '../../middlewares/file' );
const { getAnime, postAnime, getAnimeByID, getAnimeByTitle, getAnimeByGenre, getAnimeByStatus, getAnimeByRating, getAnimeBeforeYear, getAnimeAfterYear, deleteAnime, putAnime } = require( '../controllers/anime' );



const animeRouter = require('express').Router();

animeRouter.get('/', getAnime);
animeRouter.get("/:id", getAnimeByID);
animeRouter.get("/title/:title", getAnimeByTitle);
animeRouter.get("/genre/:genre", getAnimeByGenre);
animeRouter.get("/status/:status", getAnimeByStatus);
animeRouter.get("/rating/:condition/:rating", getAnimeByRating);
animeRouter.get("/release-year/before/:year", getAnimeBeforeYear);
animeRouter.get("/release-year/after/:year", getAnimeAfterYear);
animeRouter.post("/", [isAuth], [isAdmin], upload.single("image"), postAnime);
animeRouter.put("/:id", [isAuth], [isAdmin], upload.single("image"), putAnime)
animeRouter.delete("/:id", [isAuth], [isAdmin], deleteAnime);

module.exports = animeRouter;