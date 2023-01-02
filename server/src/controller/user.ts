import {Request, Response} from "express";

async function signup (req : Request, res: Response) {
    if(req) {
        return res.status(400).send("wrong");
    }
    return res.status(200).send(req);
}



export default {
    signup
}