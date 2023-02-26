const express= require('express');
const cors=require('cors')
const path= require('path')
const UserRoute=require("../Controllers/UserControl")
const Expense = require('../Controllers/Expenses');

const auth=require('../Middleware/auth')
const bodyParser= require('body-parser')


const router= express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))
const filepath= (path.join(__dirname, "../public"));

router.get("/", (req, res)=>{
    res.sendFile(filepath+"/login.html")
});
router.get("/register", (req, res)=>{
    res.sendFile(filepath+"/register.html")
});

router.get("/Expense", (req, res)=>{
    res.sendFile(filepath+"/ExpensePage.html")
});

router.get("/getAll", Expense.GetAllData);

router.post("/loginUser", UserRoute.Login);
router.post("/RegisterUser", UserRoute.RegisterUser);
router.post("/AddExpenseData", auth, Expense.insertData);
router.delete("/DeleteExpense/:id", auth, Expense.deleteData);
router.patch("/update", Expense.updateData);
router.get("/Pmembership",auth, UserRoute.PremiumMemeber)
router.post("/updatetxnstatus", auth, UserRoute.MembershipPayment);
router.get("/LeaderBoard",  UserRoute.GetLeaderBoard);

router.post("/ForgotPassword", UserRoute.ForgotPassword);
router.get("/resetPassword/", UserRoute.resetPassword);
router.post("/changePassword", UserRoute.changePassword);

router.get("/downloadFile", auth, Expense.downloadExpenseData);


module.exports=router;

