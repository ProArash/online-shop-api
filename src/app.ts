import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import express from "express";
import { PORT } from "./utils/constants";
import { routes } from "./routers";
const app = express();


const main = async () => {
    // consts

    // middlewares
    app.use(bodyParser.json());

    // routers
    app.use("/", routes);

    // launch server
    app.listen(PORT, async () => {
        console.log(`server is running on port${PORT}`);
    });
};

main();
