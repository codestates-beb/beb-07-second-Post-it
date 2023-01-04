import express, {Express} from 'express';
import morgan from 'morgan';
import AppDataSource from './db/data-source';
import corsConfig from './config/corsConfig';
import cors from "cors";

import indexRouter from "./router/index";
import userRouter from "./router/user";
import postRouter from "./router/post";

import userController from "./controller/user";

const app : Express = express();

app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(morgan("dev"));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/post', postRouter);

AppDataSource.initialize()
    .then(()=>{
       console.log("db init success");
      //  AppDataSource.synchronize();
    })
    .catch((error)=> console.log(error));

app.listen(4000, ()=>{
  // userController.create_server();
  console.log(`Listening http://localhost:${4000}`);
})