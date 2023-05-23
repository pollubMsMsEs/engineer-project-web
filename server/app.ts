import "./bin/loadEnv.js";
import "./bin/connectToDB.js";
import express, { Express } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";

import utilsRouter from "./routes/utils.js";
import apiRouter from "./routes/api.js";

const app: Express = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send(
        "You are calling Web Frameworks Project API, simple student project, there is no documentation so you have to guess endpoints yourself, have fun :)"
    );
});

app.use("/api", apiRouter);
app.use("/utils", utilsRouter);

export default app;
