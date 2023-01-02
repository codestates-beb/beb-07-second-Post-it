import { DataSource } from "typeorm";
import user from "../entity/user";
import nft from "../entity/nft";
import post from "../entity/post";
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    database: process.env.DATABASE_DATABASENAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    logging: true,
    entities: [user, nft, post],
})

AppDataSource.initialize()
    .then(()=>{
        console.log("db init success");
        // AppDataSource.synchronize();
    })
    .catch((error)=> console.log(error));


export default AppDataSource;