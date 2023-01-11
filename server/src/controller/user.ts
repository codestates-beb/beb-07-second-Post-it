import {Request, Response} from "express";
import AppDataSource from "../db/data-source";
import web3 from "../config/web3"
import user from "../entity/user";
import post from "../entity/post";
import nft from "../entity/nft";
import { updateSpreadAssignment } from "typescript";
const abi20 = require("../erc20abi.json");
const abi721 = require("../erc721abi.json");
require("dotenv").config()

async function insert (req : Request, res: Response) {
    const info = {
/*         user_id : req.body.user_id,
        tx_hash : req.body.tx_hash, */

        user_id : req.body.user_id,
        title : req.body.title,
        content : req.body.content,
        views : req.body.views

/*         nickname : req.body.nickname,
        password : req.body.password,
        address : addressress,
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

    const accounts = await web3.eth.getAccounts();
    const serverAddress = accounts[0];

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
        value: '1000000000000000000', //1이더
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
        token_amount : 0,
        eth_amount : String(eth_amount)
    }
    const userRepo = AppDataSource.getRepository(user);
    const userss = userRepo.create(info);

    const eth_amount2 = await web3.eth.getBalance(serverAddress);

    await userRepo
    .createQueryBuilder()
    .update(user)
    .set({eth_amount: ()=> eth_amount2})
    .where("id = :id", {id:1})
    .execute()


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
    if(!req.body.to_address || !req.body.from_address || !req.body.token_amount) {
        return res.status(400).send(false);
    }
    const contract = new web3.eth.Contract(abi20, process.env.CONTRACT20_ADDRESS);

    const from = req.body.from_address;
    const to = req.body.to_address;
    const amount = req.body.token_amount;

    const userFrom = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("address = :address", {address:from})
        .getOne()

    if(!userFrom) return res.status(400).send("no userFrom");

    await web3.eth.personal.unlockAccount(from,userFrom.password, 600);

    await contract.methods.transfer(to,amount).send({from});

    const to_token = await contract.methods.balanceOf(to).call();
    const from_token = await contract.methods.balanceOf(from).call();

    const userRepo = AppDataSource.getRepository(user);

    await userRepo
        .createQueryBuilder()
        .update(user)
        .set({token_amount: () => `${from_token}`})
        .where("address = :address", {address:from})
        .execute()

        await userRepo
        .createQueryBuilder()
        .update(user)
        .set({token_amount: () => `${to_token}`})
        .where("address = :address", {address:to})
        .execute()

    return res.status(200).send(true);
}

async function minting(req: Request, res:Response) {
    if(!req.body.user_id || !req.body.uri) {
        return res.status(400).send("minting error");
    }

    const accounts = await web3.eth.getAccounts();
    const serverAddress = accounts[0];
    const erc721Contract = new web3.eth.Contract(abi721, process.env.CONTRACT721_ADDRESS);
    const erc20Contract = new web3.eth.Contract(abi20, process.env.CONTRACT20_ADDRESS);

    const userss = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("id = :id", {id:req.body.user_id})
        .getOne()

    if(!userss) return res.status(400).send("no userss");

    await erc20Contract.methods.approve(process.env.CONTRACT721_ADDRESS, 10000);

    const data = erc721Contract.methods.mintNFT(userss.address, req.body.uri).encodeABI();
    const tx = {
        from: serverAddress,
        to: process.env.CONTRACT721_ADDRESS,
        gas: 5000000,
        data: data,
    };
    const signPromise = await web3.eth.accounts.signTransaction(tx, String(process.env.SERVER_PRIVATE_KEY));
    if(!signPromise.rawTransaction) return res.status(400).send("signpromise error");
    const signedTx = await web3.eth.sendSignedTransaction(signPromise.rawTransaction);

    const info = {
        user_id : req.body.user_id,
        URI : req.body.uri,
        tx_hash : signedTx.transactionHash
    }

    const userRepo = AppDataSource.getRepository(nft);
    const users = userRepo.create(info);

    await userRepo
        .save(users)
        .then((data) => {
            res.status(200).send(true);
        })
        .catch((err) => console.log(err));
}

async function buy_sell(req: Request, res:Response) {
    if(!req.body.user_id || !req.body.uri) {
        return res.status(400).send("buy_sell error");
    }
    
    //구매
    //721 transferFrom
    //20 transfer

/*     const users = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("id = :id", {id:req.body.user_id})
        .getOne()

    if(!users) return res.status(400).send("wrong user_id");

    const address = users.address;
    const accounts = await web3.eth.getAccounts();
    const serverAddress = accounts[0];
    const amount = 10000;

    await web3.eth.personal.unlockAccount(address,users.password, 600)

    const erc20Contract = new web3.eth.Contract(abi20, process.env.CONTRACT20_ADDRESS);
    const erc721Contract = new web3.eth.Contract(abi721, process.env.CONTRACT721_ADDRESS);

    const nfts = await AppDataSource
    .getRepository(nft)
    .createQueryBuilder()
    .select()
    .where("URI = :URI", {URI : req.body.uri})
    .getOne()

    if(!nfts) return res.status(400).send("wrong nft uri");

    const ownerr = await erc721Contract.methods.ownerOf(nfts.id).call();
    console.log(ownerr);
    
    const userss = await AppDataSource
    .getRepository(user)
    .createQueryBuilder()
    .select()
    .where("address = :address", {address:ownerr})
    .getOne()

    const approve = erc721Contract.methods.setApprovalForAll(address, nfts.id).call();

    const data = erc721Contract.methods.safeTransferFrom(serverAddress, address, nfts.id).encodeABI();
    const tx = {
        from: serverAddress,
        to: process.env.CONTRACT721_ADDRESS,
        gas: 5000000,
        data: data,
    };
    const signPromise = await web3.eth.accounts.signTransaction(tx, String(process.env.SERVER_PRIVATE_KEY));
    if(!signPromise.rawTransaction) return res.status(400).send("signpromise error");
    const signedTx = await web3.eth.sendSignedTransaction(signPromise.rawTransaction);

    await erc20Contract.methods.transfer(serverAddress, amount).send({from:address});

    const a = await erc721Contract.methods.balanceOf(serverAddress).call();
    const b = await erc721Contract.methods.balanceOf(address).call();
    const c = await erc20Contract.methods.balanceOf(serverAddress).call();
    const d = await erc20Contract.methods.balanceOf(address).call();

    console.log(a);
    console.log(b);
    console.log(c);
    console.log(d); */

    //DB상으로 user의 token_amount도 하나씩 빼주고 올려줘야함


    return res.status(200).send("buy_sell");
}

export default {
    insert,
    signup,
    login,
    mypage,
    send,
    minting,
    buy_sell
}