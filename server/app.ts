import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Heloł");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
