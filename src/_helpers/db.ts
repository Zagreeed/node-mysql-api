
import config from "../../config.json"
import mysql from "mysql2/promise"
import { Sequelize } from "sequelize"

export interface Database {
    User: any;
    Account: any;
}


export const db: Database = {} as Database;


export async function initialize(): Promise<void> {
    const { host, port, user, password, database } = config.database

    // const connection = await mysql.createConnection({ host, port, user, password })
    // await connection.query(`CREATE DATABASE IF NOT EXISTS \'${database}'`)

    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.end()



    const sequelize = new Sequelize(database, user, password, { dialect: "mysql" })


    const { default: userModel } = await import("../users/user.model")
    const { default: accountModel } = await import("../accounts/account.model")

    db.User = userModel(sequelize)
    db.User = accountModel(sequelize)


    await sequelize.sync({ alter: true })


    console.log("_______DATABASE INITIALIZED AND MODELS SYNCED_______")

}