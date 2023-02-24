const Sequelize= require("sequelize");
const sequelize = require("../util/database");
 const PremiumUser= sequelize.define("premiumUser",{
    
    payment_id:{
        type:Sequelize.STRING,
    },

    orderid:{
        type: Sequelize.STRING,
        
    },
    status:{
        type: Sequelize.STRING,
        
    },
    ispremium:{
        type: Sequelize.STRING,
       
    }
 
 });
 module.exports=PremiumUser;