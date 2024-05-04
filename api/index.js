import express from "express";
import cors from "cors";

import morgan from "morgan";
import general from "./routes/routergeneral.js";
const servidor = express();

servidor.use(express.json());

servidor.use(morgan("dev"));
servidor.use(express.urlencoded({ extended: true, limit: "50mb" }));

servidor.use(
  cors({
    origin: process.env.DEPLOY,
    credentials: true,
  })
);

servidor.use(express.json({ limit: "50mb" }));

servidor.use(general);

servidor.listen(3000, () => console.log("Server running on port 3000"));
