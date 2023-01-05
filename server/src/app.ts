import express, {Express} from 'express';
import morgan from 'morgan';
import AppDataSource from './db/data-source';
import corsConfig from './config/corsConfig';
import cors from "cors";

import indexRouter from "./router/index";
import userRouter from "./router/user";
import postRouter from "./router/post";

import create_server from './init';

const app : Express = express();

app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(morgan("dev"));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/post', postRouter);

app.listen(4000, ()=>{
  AppDataSource.initialize()
    .then(()=>{
       AppDataSource.synchronize();
       create_server();
    })
    .catch((error)=> console.log(error));

  console.log(`Listening http://localhost:${4000}`);
})