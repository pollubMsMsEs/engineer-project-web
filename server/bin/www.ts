import app from "../app.js";
import Debug from "debug";
const debug = Debug("project:www");

const port = process.env.PORT;

app.listen(port, () => {
    debug(`Server is running at http://localhost:${port}`);
});
