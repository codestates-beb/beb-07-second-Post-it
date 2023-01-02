import express, {Request, Response ,Router} from "express";
const router : Router = express.Router();

router.get("/", function (req : Request, res : Response) {
    console.log("//")
    return res.status(200).send("hello user")
})

router.get("/signup", function (req : Request, res : Response) {
    console.log("/signup")
    return res.status(200).send("user signup hello world");
})


module.exports = router;