import express from "express";
import { client } from "./utils/db.js";
import quoraRouter from "./apps/quora.js";
import cors from "cors";

async function init() {
  const app = express();
  const port = 4001;

  app.use(cors());
  await client.connect();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/quora", quoraRouter);

  app.get("/", (req, res) => {
    return res.json("Hello World");
  });

  app.get("*", (req, res) => {
    return res.status(404).json("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();
