import express, {Request, Response ,Router} from "express";
const router : Router = express.Router();


router.get("/", function (req: Request, res : Response) {
    console.log("in users")
    res.status(200).send("hello users")
})

router.post("/signup", function (req : Request, res : Response) {
    console.log("/signup")
    return res.status(200).send("user signup hello world");
})

export default router;