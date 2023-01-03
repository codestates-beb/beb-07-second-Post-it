import {Request, Response} from "express";
import AppDataSource from "../db/data-source";
import web3 from "../config/web3"
import user from "../entity/user";
import post from "../entity/post";
import nft from "../entity/nft";

async function insert (req : Request, res: Response) {
    const info = {
        user_id : req.body.user_id,
        title : req.body.title,
        content : req.body.content,
        views : req.body.views
    }

    const userRepo = AppDataSource.getRepository(post);
    const users = userRepo.create(info);

    await userRepo
        .save(users)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => console.log(err));
}

async function signup (req : Request, res: Response) {
    if(!req.body.nickname || !req.body.password) {
        return res.status(400).send("signup error");
    }
    const nickname = req.body.nickname;
    
    const users = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("nickname = :nickname", {nickname:nickname})
        .getOne()

    if(users) { //중복된 값있을때
        return res.status(400).send(users);
    }
    //중복된 값이 없을때
    //지갑 생성하고(가나슈에서 값 받아오기)
    //그런다음 DB에 사용자의 정보 저장

    const info = {
        nickname : nickname,
        password : req.body.password,
        address : "11111111",
        token_amount : 1111111,
        eth_amount : 22222222
    }

    const userRepo = AppDataSource.getRepository(user);
    const userss = userRepo.create(info);

    await userRepo
    .save(userss)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => console.log(err));
}

async function login (req : Request, res: Response) {
    if(!req.body.nickname || !req.body.password) {
        return res.status(400).send(false);
    }
    const nickname = req.body.nickname;
    const password = req.body.password;

    const users = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("nickname = :nickname AND password = :password", {nickname:nickname, password:password})
        .getOne()
        
    if(users) {
        return res.status(200).send(users);
    }
    else {
        return res.status(400).send("login error");
    }
}

async function mypage(req : Request, res:Response) {

    if(!req) {
        return res.status(400).send("no request");
    }
    const users = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("address = :address", {address:req.params.address})
        .getOne()

    if(!users) {
        return res.status(400).send("no user");
    }
        
    const id = users.id;

    const posts = await AppDataSource
        .getRepository(post)
        .createQueryBuilder()
        .select()
        .where("id = :id", {id:id})
        .getMany()

    const nfts = await AppDataSource
        .getRepository(nft)
        .createQueryBuilder()
        .select()
        .where("id = :id", {id:id})
        .getMany()

    return res.status(200).send({
        user : users,
        post : posts,
        nft : nfts
    });
}

async function send(req : Request, res:Response) {
    if(!req.body.address || !req.body.token_amount) {
        return res.status(400).send(false);
    }
    //아 여기 from, to도 보내주는건지
    //아니면 web3같은걸로 내가 직접 해야하는지



    return res.status(200).send(true);
}

export default {
    insert,
    signup,
    login,
    mypage,
    send
}