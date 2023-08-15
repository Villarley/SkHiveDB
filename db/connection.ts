import { Sequelize } from "sequelize";


const db = new Sequelize('SkHiveDB-test', 'postgres', '3.1415926', {
    host: 'localhost',
    port: 5432,
    dialect: "postgres",
    // logging: false
});


export default db;
