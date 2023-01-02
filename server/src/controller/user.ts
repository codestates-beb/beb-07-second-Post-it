import {Request, Response} from "express";

async function signup (req : Request, res: Response) {
    if(!req.body.nickname || !req.body.password) {
        return res.status(400).send("signup error");
    }
    return res.status(200).send(req.body);
}

async function login (req : Request, res: Response) {
    if(!req.body.nickname || !req.body.password) {
        return res.status(400).send(false);
    }
    return res.status(200).send(true);
}

async function mypage(req : Request, res:Response) {
    if(!req.params.user_id) {
        return res.status(400).send("mypage error");
    }
    return res.status(200).send("myapge success");
}

async function send(req : Request, res:Response) {
    if(!req.body.address || !req.body.token_amount) {
        return res.status(400).send(false);
    }
    return res.status(200).send(true);
}

export default {
    signup,
    login,
    mypage,
    send
}