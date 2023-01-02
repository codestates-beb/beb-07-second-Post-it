import express, {Express} from 'express';
import morgan from 'morgan';
import AppDataSource from './db/data-source';

const app : Express = express();

import indexRouter from "./router/index";
import userRouter from "./router/user";

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(morgan("dev"));

app.use('/', indexRouter);
app.use('/users', userRouter);

AppDataSource.initialize()
    .then(()=>{
        console.log("db init success");
        //AppDataSource.synchronize();
    })
    .catch((error)=> console.log(error));


app.listen(4000, ()=>{
  console.log(`Listening http://localhost:${4000}`);
})