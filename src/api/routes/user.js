const { isAuth } = require( "../../middlewares/auth" );
const { register, login, getUser, getUserByID, updateUser, deleteUser } = require( "../controllers/user" );

const userRouter = require("express").Router();

userRouter.get("/", getUser);
userRouter.get("/:id", getUserByID);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.put("/:id", [isAuth], updateUser);
userRouter.delete("/:id", [isAuth], deleteUser);

module.exports = userRouter;