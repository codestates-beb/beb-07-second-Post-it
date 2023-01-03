import express, {Request, Response ,Router} from "express";
import userController from "../controller/user"
const router : Router = express.Router();

router.get("/", function (req : Request, res : Response) {
    return res.status(200).send("hello user")
})

router.post("/insert", userController.insert);

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/mypage/:id", userController.mypage);

router.post("/send", userController.send);

export default router;
