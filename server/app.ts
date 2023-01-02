import express, { Request, Response } from "express";

const app = express();


app.get("/", (req: Request, res: Response) => {
  res.send("11111");
});

app.listen(4000)