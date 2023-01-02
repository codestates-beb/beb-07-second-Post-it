import express, {Express} from 'express';
// import router from "./router/index";

const app : Express = express();
// require("dotenv").config();
// const PORT = process.env.PORT || 4000;

const indexRouter = require("./router/index")
const userRouter = require("./router/user")

app.use('/', indexRouter);
app.use('/users', userRouter);

app.listen(4000, ()=>{
  console.log(`Listening http://localhost:${4000}`);
})