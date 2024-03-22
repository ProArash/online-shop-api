import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import express from "express";
import { PORT } from "./utils/constants";
import { routes } from "./routers";
import { reqLogger } from "./middlewares/req.middleware";
import morgan from "morgan";
const app = express();

const main = async () => {
    // middlewares
    app.use(bodyParser.json());
    app.use(morgan("dev"));

    // routers
    app.use("/", routes);

    // launch server
    app.listen(PORT, async () => {
        console.clear();
        console.log(`server is running on port: ${PORT}`);
    });
};

main();
