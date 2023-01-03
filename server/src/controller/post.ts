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
      .getRepository(post)
      .createQueryBuilder()
      .select()
      .where("id >= :id*10+1 AND id <= :id*10+10", {id:id})
      .getMany()

    if(!posts) {
        return res.status(400).send("No posts");
    }
    
    const users = await AppDataSource
        .getRepository(user)
        .createQueryBuilder()
        .select()
        .getMany()


    const data = [];
    
    for(let i = 0; i<10;i++) {
        for(let j=0;j<users.length;j++) {
            if(posts[i].user_id === users[j].id) {
                const temp = {
                    id : posts[i].id,
                    title : posts[i].title,
                    nickname : users[j].nickname,
                    created_at : posts[i].created_at,
                    views : posts[i].views
                }
                data.push(temp);
            }
        }
    }
    return res.status(200).send(data);
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