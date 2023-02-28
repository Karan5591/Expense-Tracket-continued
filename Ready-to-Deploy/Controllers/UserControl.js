const express= require('express');
const bcrypt= require('bcrypt')
const bodyParser= require('body-parser')
const jwt=require('jsonwebtoken');
const dotenv= require('dotenv')
var Razorpay=require("razorpay");
const path=require("path")
const User= require("../models/users")
const Expense=require("../models/expenses");
const nodemailer= require("nodemailer");
const randomstring= require("randomstring");
const premiumUser=require("../models/premiumUser");
const sequelize = require('../util/database');
const forgetPassword=require("../models/forgetPassword")

const users = require('../models/users');
const sib= require('sib-api-v3-sdk')
const uuid = require('uuid');

const app=express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
const client= sib.ApiClient.instance;
const apiKey= client.authentications['api-key']
apiKey.apiKey= process.env.api_key;



///==================Forget Password===========

exports.ForgotPassword=(async(req, res)=>{

try{
   const emailCheck= await User.findOne({where:{ email: req.body.email}});
           
  if(!emailCheck)
  {
   res.send ("Email not registered with us");
  }
  else
  {
    const tranEmailApi= new sib.TransactionalEmailsApi()
  const u_id= uuid.v1();
  console.log(u_id);
  const sender={
  email: process.env.EMAIL,
}
const receiver= [{
  email: req.body.email,
}]

tranEmailApi.sendTransacEmail({
  sender,
  to: receiver,
  subject: "Reset Password",
  textContent:`<html><body>Reset passowrd using link <a href="http://localhost:3000/resetPassword?c=${u_id}"></a></body></html>`
})
.then((resolve)=>{
  forgetPassword.create({uuid: u_id, user_id: emailCheck.id, isactive: 'true'})
  res.send("Password reset link has been sent to your registered Email")
  
})
.catch(err=>console.log(err));
  }
}

catch(err)
{
  console.log(err)
}
})

exports.resetPassword=(async(req, res)=>{

  try
  {
    const check= await forgetPassword.findOne({where:{uuid:req.query.c}})
   
    
    if(check && check.isactive=='true')
    {
      forgetPassword.update({isactive:'false'}, {where:{uuid:req.query.c}})
      res.redirect(`/changePassword.html?c=${req.query.c}`);
      
    }
    else
    {
      res.send("Link Expired");
    }
  }
  catch(err)
  {
    console.log(err);
  }
    
});

exports.changePassword= (async (req, res)=>{
  
  console.log(req.body.pwd);
  console.log(req.body.data);
  const hashPassword=  await bcrypt.hash(req.body.pwd, 10)
 try
  {   
       const check= await forgetPassword.findOne({where:{uuid: req.body.data}})

         await User.update({password: hashPassword}, 
          
          {where:{id: check.user_id} } )
        res.send("Password updated")
  }
  catch (err)
  {
      console.log(err);
  }
})

//============================================================

exports.RegisterUser=(async(req, res)=>{
    try
    {
      console.log(req.body);
        const name= req.body.name;
        const email= req.body.email;
        const password= req.body.password;
        const hashPassword=  await bcrypt.hash(password, 10)
        const emailCheck= await User.findOne({where:{ email: req.body.email}});
           
           if(emailCheck)
           {
            res.send("Email Already Exist");
           }
           else
           {
            await User.create({name: name, email: email, password: hashPassword, ispremium: "False", TotalExpense: '0'});
           
            res.send("Registered Successfully");
           }
        }
    catch (err)
    {
        console.log(err);
    }
    
});

exports.Login=(async (req, res)=>{

     try
        {
            const emailCheck=await User.findOne({where:{email: req.body.email}})
            if(!emailCheck)
            {
                 res.status(404).send("Wrong Email Entered");
            }
             else if(!await bcrypt.compare(req.body.password, emailCheck.password))
            {
                res.status(404).send("Wrong password");
            }
            else
            {
                const token = jwt.sign(
                    { user_id: emailCheck.id },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: "1h",
                    }
                  );
                  res.cookie("jwtoken", token).send("Logged In");
            }
        }
        catch (err)
        {
            console.log(err);
        }
       
});

const rzp = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
  })

exports.PremiumMemeber=(async(req, res)=>{
    try{

        const amount=2500;
      await rzp.orders.create({amount: amount, currency: "INR"}, async(err, order)=>
      {
        if(err)
          {
            throw new Error(JSON.stringify(err));
          }
          else
          {
           await premiumUser.create({id: req.id, orderid: order.id, status:'pending', ispremium:'false'})
           {
            if(err)
            {
              console.log(err)
            }
            else
            {
              res.send([order.id, rzp.key_id])
            }
           }
        }
            
          })
        }
        
      catch(err)
      {
        console.log(err);
    }

});

exports.MembershipPayment=(async(req, res)=>{

    const Pid=req.body.body.payment_id;
    await new Promise( async(resolve, reject)=>{
      try{ 
            if (Pid==0)
            {
                await premiumUser.update({paymentid:Pid, status:"Failed", ispremium:"False"}, {where:{id: req.id}}) 
                reject("Payment cancelled");
            }
              else 
            {
            await premiumUser.update({paymentid:Pid, status:"Successful", ispremium:"True"}, {where:{id: req.id}}) 
            resolve ("Payment Successful");
        }
    }
    catch(err){
        console.log(err);
      }
  
    })
    .then(resolve=>res.send(resolve))
    .catch(err=>res.send(err));
  })
exports.GetLeaderBoard=(async(req, res)=>{
    
        try
        {
                const data= await User.findAll({
                attributes: ["name", "TotalExpense"],
                order: sequelize.literal('TotalExpense DESC'),
                
            })
            
            res.send(data);
        }
        catch(err)
        {
            console.log(err);
        }
    
    
})




