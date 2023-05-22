import "./loadEnv.ts";
import "./connectToDB.ts";
import express, { Express } from "express";

const app: Express = express();

app.get("/", (req, res) => {
    res.send(
        "You are calling Web Frameworks Project API, simple student project, there is no documentation so you have to guess endpoints yourself, have fun :)"
    );
});

export default app;
