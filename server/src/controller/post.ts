import {Request, Response} from "express";
import web3 from "../config/web3";
import AppDataSource from "../db/data-source";
import post from "../entity/post";
import user from "../entity/user";
const abi20 = require("../erc20abi.json");
require("dotenv").config()

async function postlist (req: Request, res: Response) {
    if(!req.query.id) {
        return res.status(400).send("not request");
    }
    const id = Number(req.query.id);

    const posts = await AppDataSource
        .query("SELECT post.*, user.nickname FROM post INNER JOIN user ON post.user_id=user.id WHERE post.id > ?*10 ORDER BY post.id LIMIT 10;", [id])

    return res.status(200).send(posts);
}

async function wpost (req: Request, res: Response) {
    if(!req.body.user_id || !req.body.title || !req.body.content) {
        return res.status(400).send(false);
    }

    const user_id = req.body.user_id;
    const title = req.body.title;
    const content = req.body.content;
    const reward_amount = 100000;

    const contract = new web3.eth.Contract(abi20, process.env.CONTRACT_ADDRESS);
    const accounts = await web3.eth.getAccounts();

    const posts = await AppDataSource
        .getRepository(post)
        .createQueryBuilder()
        .insert()
        .into(post)
        .values([
            {user_id:user_id, title:title,content:content, views:0}
        ])
        .execute()

    const users = await AppDataSource
    .getRepository(user)
    .createQueryBuilder()
    .select()
    .where("id = :user_id", {user_id:user_id})
    .getMany()

    const to = users[0].address;
    const from = accounts[0];
    await contract.methods.transfer(to,reward_amount).send({from});
    
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

    return res.status(200).send(users[0].address);
}

async function getpost (req: Request, res: Response) {
    const id = Number(req.query.id); //post table의 아이디

    const userRepo = AppDataSource.getRepository(post);

    await userRepo
        .createQueryBuilder()
        .update(post)
        .set({views: ()=> "views+1"})
        .where("id = :id", {id:id})
        .execute()

    const posts = await AppDataSource
    .query("SELECT post.*, user.nickname FROM post INNER JOIN user ON post.user_id=user.id WHERE post.id=?;", [id])

    if(!posts) {
        return res.status(200).send("no posts");
    }
    return res.status(200).send(posts);
}

export default {
    postlist,
    wpost,
    getpost
}