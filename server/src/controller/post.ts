import {Request, Response} from "express";
import internal from "stream";
import AppDataSource from "../db/data-source";
import post from "../entity/post";
import user from "../entity/user";

async function postlist (req: Request, res: Response) {

    if(!req.query.id) {
        return res.status(400).send("not request");
    }
    const id = req.query.id;

    const posts = await AppDataSource
        .query("SELECT post.*, user.nickname FROM post INNER JOIN user ON post.user_id=user.id WHERE post.id > ?*10 ORDER BY post.id LIMIT 10;", [id]);
    

    return res.status(200).send(posts);
}

async function wpost (req: Request, res: Response) {
    if(!req.body.user_id || !req.body.title || !req.body.content) {
        return res.status(400).send(false);
    }

    const posts = await AppDataSource
        .getRepository(post)
        .createQueryBuilder()
        .insert()
        .into(post)
        .values([
            {user_id:req.body.user_id, title:req.body.title,content:req.body.content, views:0}
        ])
        .execute()
    
    return res.status(200).send(true);
}

async function getpost (req: Request, res: Response) {
    /**
     * 
     * 준석님 post 정보가 넘어올 때 유저의 닉네임이 없습니다.
     * 
     *  */

    const posts = await AppDataSource
        .getRepository(post)
        .createQueryBuilder()
        .select()
        .where("id = :id", {id:req.query.id})
        .getOne()

    if(!posts) {
        return res.status(200).send("no posts");
    }
    return res.status(200).send({
        id: posts.id,
        title: posts.title,
        content : posts.content,
        user_id: posts.user_id,
        created_at: posts.created_at,
        views: posts.views
    });
}

export default {
    postlist,
    wpost,
    getpost
}