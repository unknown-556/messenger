import express from "express";
import authRoute from '../routes/authRoute.js'
import userRoute from '../routes/userRoute.js'
import messageRoute from '../routes/messageRoute.js'
const router = express.Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/message', messageRoute)

export default router;