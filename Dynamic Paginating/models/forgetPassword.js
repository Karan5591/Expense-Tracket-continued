const Sequelize= require("sequelize");
const sequelize = require("../util/database");

const forgetPassword= sequelize.define("forgetPassword",{
    uuid:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey:true,
    },
    user_id:{
        type: Sequelize.INTEGER,
        
    },

    isactive:{
        type: Sequelize.STRING,
        
    },
    
 
 });
 module.exports=forgetPassword;


