import {Request, Response} from "express";
import AppDataSource from "../db/data-source";
import web3 from "../config/web3"
import user from "../entity/user";
import post from "../entity/post";
import nft from "../entity/nft";
import erc20invoke from "../web3invoke/invoke";
import { getServers } from "dns";
require("dotenv").config()

async function insert (req : Request, res: Response) {
    const info = {
/*         user_id : req.body.user_id,
        token_id : req.body.token_id,
        tx_hash : req.body.tx_hash, */

        user_id : req.body.user_id,
        title : req.body.title,
        content : req.body.content,
        views : req.body.views

/*         nickname : req.body.nickname,
        password : req.body.password,
        address : req.body.address,
        token_amount : req.body.token_amount,
        eth_amount : req.body.eth_amount, */
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

    if(users) {
        return res.status(400).send({
            message:"중복된 계정이 있음",
            users
        });
    }
    
    const address = await web3.eth.personal.newAccount(String(req.body.password));

    await web3.eth.accounts.signTransaction({
        to: address,
        value: '2000000000000000000', //2이더
        gas: 21000,
    }, process.env.SERVER_PRIVATE_KEY || "", function (err, result) {
        if(err) {
            console.log(err);
            return res.status(400).send("지갑생성 오류");
        }
        if(result.rawTransaction===undefined) {
            return res.status(400).send("result.rawTransaction이 없음");
        }
        web3.eth.sendSignedTransaction(result.rawTransaction);
    });
    
    const eth_amount = await web3.eth.getBalance(address);

    const info = {
        nickname : nickname,
        password : req.body.password,
        address : address,
        token_amount : "0",
        eth_amount : String(eth_amount)
    }
    const userRepo = AppDataSource.getRepository(user);
    const userss = userRepo.create(info);

    await userRepo
    .save(userss)
    .then((data) => {
        return res.status(200).send(data);
    })
    .catch((err) => {
        return res.status(400).send(err)
    });
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
        .where("id = :id", {id:req.params.id})
        .getOne()

    if(!users) {
        return res.status(400).send("no user");
    }
        
    const id = users.id;

    const posts = await AppDataSource
        .getRepository(post)
        .createQueryBuilder()
        .select()
        .where("user_id = :id", {id:id})
        .getMany()

    const nfts = await AppDataSource
        .getRepository(nft)
        .createQueryBuilder()
        .select()
        .where("user_id = :id", {id:id})
        .getMany()

    return res.status(200).send({
        user : users,
        post : posts,
        nft : nfts
    });
}

async function send(req : Request, res:Response) {
    /* if(!req.body.address || !req.body.token_amount) {
        return res.status(400).send(false);
    } */
    // from: user_address, to: address, token_amount
    //아 여기 from, to도 보내주는건지
    //아니면 web3같은걸로 내가 직접 해야하는지
    const serverAddress = await erc20invoke.getServerAddress();

    const serverbal = await erc20invoke.BalanceOf(serverAddress);
    // console.log((await erc20invoke.Obj).methods.balanceOf(serverAddress));
    console.log(serverbal)
    console.log(serverAddress);


    return res.status(200).send(true);
}

async function minting(req: Request, res:Response) {
    console.log(req.body)
    if(!req) {
        return res.status(400).send("minting error");
    }
    return res.status(200).send("minting success");
}


export default {
    insert,
    signup,
    login,
    mypage,
    send,
    minting
}