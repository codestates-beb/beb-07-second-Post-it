import { DataSource } from "typeorm";
import user from "../entity/user";
import nft from "../entity/nft";
import post from "../entity/post";
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "postit",
//    logging: true,
    entities: [user, nft, post],
})


export default AppDataSource;