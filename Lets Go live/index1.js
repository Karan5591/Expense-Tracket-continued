const express= require('express');
const cors=require('cors')
const bodyParser= require('body-parser')
const routes= require('./routes/routes')
const path= require('path')
const cookieParser= require('cookie-parser')
const helmet= require('helmet');
const compression= require('compression')
const morgan= require("morgan")
const fs= require('fs');
const accessLogStream= fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});

const app=express();
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream }))



const users= require("./models/users")
const expenses=require("./models/expenses")
const forgetPassword=require("./models/forgetPassword")



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

app.use(cors());
//app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,"public")));

app.use("/", routes);

app.listen((3000), (req, res)=>{
    console.log("Server Started");
});