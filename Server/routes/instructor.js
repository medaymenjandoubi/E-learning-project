import express from "express"

//middleware
import { requireSignin } from "../middlewares";

const router = express.Router();

//controllers
import {makeInstructor,getAccountStatus,currentInstructor} from '../controllers/instructor.js'

router.post('/make-instructor',requireSignin, makeInstructor)
router.get("/get-account-status",requireSignin, getAccountStatus)
router.get("/current-instructor", requireSignin,currentInstructor)

module.exports = router;