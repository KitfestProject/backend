import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", (_: Request, res: Response) => {
  return res.json({ links: ["https://theater.ke"] });
});

export default app;
