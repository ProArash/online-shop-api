import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import express from "express";
const app = express();

const main = async () => {
    // consts
    const PORT = process.env.PORT || 3000;

    // middlewares
    app.use(bodyParser.json());

    // routers

    // launch server
    app.listen(PORT, async () => {
        console.log(`server is running on port${PORT}`);
    });
};

main();
