import {Request, Response} from "express";
import AppDataSource from "../db/data-source";
// import web3 from "../config/web3"
import user from "../entity/user";
import post from "../entity/post";
import nft from "../entity/nft";
const abi20 = require("../erc20abi.json");
const abi721 = require("../erc721abi.json");
require("dotenv").config()

import Web3Connect from "../config/web3";

const web3Connect = new Web3Connect();

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

    const serverAddress = await web3Connect.getServerAddress();

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
    
    const userAddress = await web3Connect.createAddress(String(req.body.password));

    await web3Connect.sendEth(userAddress);

    const createUserEth = await web3Connect.getBalance(userAddress)

    const info = {
        nickname : nickname,
        password : req.body.password,
        address : userAddress,
        token_amount : 0,
        eth_amount : String(createUserEth)
    }

    const servers = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("address = :address", {address:serverAddress})
        .getOne()

    if(!servers) return res.status(400).send("no servers");

    const userRepo = AppDataSource.getRepository(user);
    const userss = userRepo.create(info);

    const serverEth = await web3Connect.getBalance(serverAddress)

    await userRepo
    .createQueryBuilder()
    .update(user)
    .set({eth_amount: () => serverEth})
    .where("id = :id", {id:servers.id})
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
    const contract = await web3Connect.getERC20Contract(abi20, String(process.env.CONTRACT20_ADDRESS));

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

    await web3Connect.unlockAccount(from, userFrom.password, 600);

    await contract.transfer(to, from, amount);

    const to_token = await contract.balanceOf(to);
    const from_token = await contract.balanceOf(from);

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

    const serverAddress = await web3Connect.getServerAddress();
    const erc721Contract = await web3Connect.getERC721Contract(abi721, String(process.env.CONTRACT721_ADDRESS));
    const erc20Contract = await web3Connect.getERC20Contract(abi20, String(process.env.CONTRACT20_ADDRESS));


    const userss = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .where("id = :id", {id:req.body.user_id})
        .getOne()

    if(!userss) return res.status(400).send("no userss");

    await web3Connect.unlockAccount(userss.address,userss.password, 600);

    await erc20Contract.approve(String(process.env.CONTRACT721_ADDRESS), userss.address, 10000)

    const tx_hash = await erc721Contract.mintNFT(userss.address, req.body.uri, serverAddress);

    if (tx_hash) {
        const token_id = await erc721Contract.getTokenId(req.body.uri);

        const userRepo = AppDataSource.getRepository(nft)
        const users = userRepo.create({
            user_id : req.body.user_id,
            token_id : token_id,
            tx_hash : tx_hash
        })
        await userRepo.save(users);

        return res.status(200).send("success")
    }


    return res.send("unknown").end()
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