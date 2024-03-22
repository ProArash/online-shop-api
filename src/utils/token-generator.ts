import { SECRET } from "./constants";
import jwt from 'jsonwebtoken'
import { IUserPayload } from "./interfaces";

export const tokenGenerator = async (payload: IUserPayload) => {
    return await jwt.sign(payload, SECRET, { expiresIn: "1d" });
};
