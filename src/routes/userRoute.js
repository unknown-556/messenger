import express from "express";
import { deleteAllUsers, deleteSingleUser, freezeAccount, getAllUsers, getSingleUser,updateUser } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router()

router.get("/", protectRoute, getAllUsers)
router.get("/:id", protectRoute,getSingleUser)
router.delete("/delete-all", deleteAllUsers)
router.patch('/update/:id', updateUser)
router.delete("/delete/:id", deleteSingleUser)
router.put("/freeze", protectRoute, freezeAccount);

export default router