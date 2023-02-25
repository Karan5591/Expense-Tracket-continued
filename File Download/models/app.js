

const sequelize= require("../util/database")
const users= require("./users")
const expenses=require("./expenses")
const PremiumUser=require("./premiumUser")
const forgetPassword=require("./forgetPassword")

// users.hasOne(PremiumUser);

 users.hasMany(forgetPassword, {
    foreignKey: 'user_id',
   
});
forgetPassword.belongsTo(users, {
    foreignKey: 'user_id',
    
    
})



// users.hasMany(expenses)
// expenses.belongsTo(users)

sequelize
.sync()
.then((result)=>{
    console.log(result);
})
.catch((err)=>{
    console.log(err);
})

