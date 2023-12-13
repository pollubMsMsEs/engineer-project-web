import "./bin/loadEnv.js";
import "./bin/connectToDB.js";
import express, { Express } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import apiRouter from "./routes/api.js";

const app: Express = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get("/healthz", (req, res) => {
    res.send("ok");
});

app.use("/api", apiRouter);

export default app;
