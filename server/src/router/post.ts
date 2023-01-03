import express, {Request, Response ,Router} from "express";
import postController from "../controller/post"
const router : Router = express.Router();

router.get("/", function (req : Request, res : Response) {
    return res.status(200).send("hello posterr")
})

router.get("/postlist", postController.postlist);

router.post("/wpost", postController.wpost);

router.get("/getpost", postController.getpost);

export default router;