import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize('SkHiveDB-test', 'postgres', process.env.DB_PASSWORD, {
    host: 'localhost',
    port: 5432,
    dialect: "postgres",
    // logging: false
});


export default db;
