const sequelize = require("../util/database");

const Sequelize= require("sequelize");
 const expenses= sequelize.define("expenses",{
    productid:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    amount:{
        type: Sequelize.INTEGER,
        
    },
    category:{
        type: Sequelize.STRING
    },
    description:{
        type: Sequelize.STRING
    },
    user_id:{
        type: Sequelize.INTEGER,
        
    }

 
 });
 module.exports=expenses;

