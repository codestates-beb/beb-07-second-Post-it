import express, {Request, Response, Router}  from "express";
import { deflateRaw } from "zlib";
const router : Router = express.Router();

router.get("/", function(req,res) {
    return res.status(200).send("index router, hello world");
});

export default router;