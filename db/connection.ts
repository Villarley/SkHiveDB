import { Sequelize } from "sequelize";


const db = new Sequelize('SkHiveDB-test', 'postgres', 'Santivilla23?', {
    host: 'localhost',
    port: 5432,
    dialect: "postgres",
    // logging: false
});


export default db;
