import {Request, Response} from "express";
import AppDataSource from "../db/data-source";
import web3 from "../config/web3"
import user from "../entity/user";
import post from "../entity/post";
import nft from "../entity/nft";

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

async function create_server () {
    console.log("서버만들기 들어갑니다");
    const accounts = await web3.eth.getAccounts();
    const serverAddress = accounts[0];
    const eth_amount = Number(web3.eth.getBalance(serverAddress));

    const users = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("address = :address", {address:serverAddress})
        .getOne()

    if(users) {
        console.log("서버 지갑 이미 있습니다.");
    }
    else { //서버 지갑이 없으면 새로 insert해줘야함
        const info = {
            nickname : "server",
            password : "secret", //그냥 password  OR  private_key
            address : serverAddress,
            token_amount : 1111111, //서버계정으로 token배포하고 배포한 토큰수만큼 가져오기
            eth_amount : 222222, //eth양을 가져오는 함수
        }
        const userRepo = AppDataSource.getRepository(user);
        const userss = userRepo.create(info);
    
        await userRepo
        .save(userss)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => console.log(err));
        console.log("서버계정을 생성해주었습니다.!");
    }
}

async function signup (req : Request, res: Response) {
    if(!req.body.nickname || !req.body.password) {
        return res.status(400).send("signup error");
    }
    create_server();
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

    const address = String(web3.eth.personal.newAccount(req.body.password));
    console.log(address);
/*     const info = {
        nickname : nickname,
        password : req.body.password,
        address : address,
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
    .catch((err) => console.log(err)); */
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
    if(!req.body.address || !req.body.token_amount) {
        return res.status(400).send(false);
    }
    //아 여기 from, to도 보내주는건지
    //아니면 web3같은걸로 내가 직접 해야하는지



    return res.status(200).send(true);
}

async function minting(req: Request, res:Response) {
    if(!req) {
        return res.status(400).send("minting error");
    }
    return res.status(200).send("minting success");
}


export default {
    insert,
    create_server,
    signup,
    login,
    mypage,
    send,
    minting
}