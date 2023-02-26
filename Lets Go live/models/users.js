const Sequelize= require("sequelize");
const sequelize = require("../util/database");

const users= sequelize.define("users",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true,
    },
    name:{
        type: Sequelize.STRING,
        
    },
    email:{
        type: Sequelize.STRING,
        
    },
    password:{
        type: Sequelize.STRING,
       
    },
    ispremium:{
        type: Sequelize.STRING,
       
    },
    TotalExpense:{
        type: Sequelize.INTEGER
    }
 
 });
 users.associate=(models)=>{
    users.hasMany(models.expenses)
}
 module.exports=users;


