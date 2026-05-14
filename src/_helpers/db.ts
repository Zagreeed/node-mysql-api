import 'mysql2';
// import config from "../../config.prod.json"
import mysql from "mysql2/promise"
import { Sequelize } from "sequelize"

export interface Database {
    User: any;
    Account: any;
    RefreshToken: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
    const host = process.env.DB_HOST ?? '';
    const port = Number(process.env.DB_PORT ?? 3306);
    const user = process.env.DB_USER ?? '';
    const password = process.env.DB_PASSWORD ?? '';
    const database = process.env.DB_NAME ?? '';

    // ↓ Add ssl to the raw mysql2 connection
    const connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
        /// UNCOMMENTED FOR PRODUCTION
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.end();

    // ↓ Add ssl to the Sequelize connection
    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: "mysql",
        /// UNCOMMENTED FOR PRODUCTION
        dialectOptions: {
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            }
        }
    });

    const { default: userModel } = await import("../users/user.model")
    const { default: accountModel } = await import("../accounts/account.model")
    const { default: refreshTokenModel } = await import("../accounts/refresh-token.model")

    db.User = userModel(sequelize)
    db.Account = accountModel(sequelize)
    db.RefreshToken = refreshTokenModel(sequelize)

    db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" })
    db.RefreshToken.belongsTo(db.Account)

    await sequelize.sync()

    console.log("_______DATABASE INITIALIZED AND MODELS SYNCED_______")
}