import {Request, Response} from "express";
import AppDataSource from "../db/data-source";
import post from "../entity/post";

async function postlist (req: Request, res: Response) {
    //여기도 Join이 필요해보임
    //정민님과 함꼐 하는 게시글리스트시간!!!!!
    if(!req) {
        return res.status(400).send("not request");
    }
    const posts = await AppDataSource //join써서 nickname가져오기
      .getRepository(post)
      .createQueryBuilder()
      .select()
      .getMany()

    if(!posts) {
        return res.status(400).send("No posts");
    }
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