
const Sequelize= require("sequelize");
const dotenv= require('dotenv')

const sequelize= new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: "mysql",
    host:"localhost"
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });
module.exports=sequelize;

