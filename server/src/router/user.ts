import express, {Request, Response ,Router} from "express";
const router : Router = express.Router();

const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.post("/signup", function (req, res) {
    return res.status(200).send("user signup hello world");
})


export default router;