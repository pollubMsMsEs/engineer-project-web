import mongoose from "mongoose";
import Debug from "debug";
const debug = Debug("db");

mongoose
    .connect(process.env.MONGODB!)
    .then((connection) => {
        debug(`Successfully connected to database`);
    })
    .catch((er) => {
        debug("Couldn't connect to database because: \n" + er);
    });
