import jwt from "express-jwt"
import config from "../../config.json"
import db from "../_helpers/db"

const { secret } = config

export default function authorize(roles: any = []) {
    if (typeof roles === "string") {
        roles = [roles]
    }

    return [
        jwt({ secret, algorithms: ["HS256"] }),
        async (req: any, res: any, next: any) => {
            const account = await db.ccount
        }
    ]
}

