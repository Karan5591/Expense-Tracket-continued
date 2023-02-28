const express= require('express');
const cors=require('cors')
const bodyParser= require('body-parser')
const routes= require('./routes/routes')
const path= require('path')
const cookieParser= require('cookie-parser')
//const helmet= require('helmet');
const compression= require('compression')
const morgan= require("morgan")
const fs= require('fs');
const dotenv= require('dotenv');
const accessLogStream= fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});

const app=express();
dotenv.config();
app.use(cookieParser());
//app.use(helmet();
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream }))

const users= require("./models/users")
const expenses=require("./models/expenses")
const forgetPassword=require("./models/forgetPassword");
const exp = require('constants');
app.use(cors());
app.use(express.static(__dirname+"/public"));

users.hasMany(expenses, {
    foreignKey: 'user_id',
   
});
expenses.belongsTo(users, {
    foreignKey: 'user_id'
})
users.hasMany(forgetPassword, {
    foreignKey: 'user_id',
   
});
forgetPassword.belongsTo(users, {
    foreignKey: 'user_id',
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
//app.use(express.static(path.join(__dirname,"public")));

app.use("/", routes);

app.listen((process.env.PORT || 3000), (req, res)=>{
    console.log("Server Started");
});