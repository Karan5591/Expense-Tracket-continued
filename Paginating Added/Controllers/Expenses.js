const express= require('express');
const expenses= require('../models/expenses');
const users=require('../models/users');
const sequelize = require('../util/database');
const AWS= require('aws-sdk')
const dotenv= require('dotenv')

dotenv.config();


exports.GetAllData= (async (req, res)=>{

    try
    {   
       let pageNo=req.query.page;
       if(pageNo=='0')
       {
        pageNo+=1;
       }
       let limitPage= (pageNo-1)*4;
        const promise= await new Promise((resolve, reject)=>{
           const expenseData= users.findAll({
            
            attributes:['ispremium'],
            
            include: [{
                offset:limitPage,
                limit: 4,
                model: expenses, 
                attributes: ['productid', 'amount', 'description', 'category']}],
           
            
            
            where:{id:'2'},
           
        });
           resolve(expenseData);
        })
        .then (resolve=>res.send(resolve));

    }
    catch (err)
    {
        console.log(err);
    }
})

exports.insertData= (async (req, res)=>{
    const transaction= await sequelize.transaction();
        const amount=req.body.amount;
    const description= req.body.description;
    const category= req.body.category;
    const userid=req.id;
    const totalexpense= await users.findOne({
        attributes: ["TotalExpense"],
        where:{id: req.id},
        raw: true
    })
    let totalExpense=totalexpense.TotalExpense;
    const newExpense= parseInt(totalExpense)+ parseInt(amount);

    const insertData= await expenses.create({amount: amount, description:description, category: category, user_id: req.id}, {transaction: transaction})
    .then(expense=>{
        
        users.update({TotalExpense: newExpense}, {where:{id:req.id}, 
            transaction:transaction})
            .then(async()=>{
              await  transaction.commit();
                res.status(200).redirect("/Expense")
            })
            .catch(async(err)=>{
               await transaction.rollback();
                return res.status(500).json({success: false})
            })
                 
    })
    .catch(async(err)=>{
       await transaction.rollback();
        return res.status(500).json({success: false})
})

})


exports.deleteData= (async (req, res)=>{
    const id= req.params.id
    const row = await expenses.findOne({
        attribute:['amount'],
        where: { productid: id },
       include: {model: users, attributes: ['TotalExpense'], where:{id:req.id}}
           
      });
      
      if (row) {
        const transaction=sequelize.transaction();
        await row.destroy()
        .then(response=>
            {
                const deleteAmount= response.user.TotalExpense;
                const updatedAmount= parseInt(deleteAmount)-parseInt(response.amount);
                console.log(deleteAmount);
                console.log(updatedAmount);
                expenses.update({TotalExpense: updatedAmount}, {where:{id:req.id}})
            })
            
            //console.log(response.user.TotalExpense)); 
      }
      res.send("Data Deleted");
    
})



exports.updateData= (async (req, res)=>{
    const amount=req.body.amount;
    const description= req.body.description;
    const category= req.body.category;
    const productid=req.body.productid;

    try
    {   
        const promise= await new Promise(async (resolve, reject)=>{
           const insertData= await expenses.update({amount: amount, description:description, category: category}, {where:{productid: productid} } )
           resolve(insertData);
           
        })
        .then (resolve=>res.send("Data Added Successfully"));

    }
    catch (err)
    {
        console.log(err);
    }
})

function uploadToS3(data, filename)
{
    let s3bckt= new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
       
    })
    
        var params={
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'

        }
        return new Promise((resolve, reject)=>
        {

        
        s3bckt.upload(params, (err, data)=>{
            if(err){
                console.log("Something wrong")
                reject ("Something Went Wrong");
            }
            else{
                console.log("success", data);
                resolve (data.Location);
            }
        })
    })
    
}

exports.downloadExpenseData= (async(req, res)=>{
    try
    {

   
    const expenseData= await expenses.findAll({
        attributes: ['productid', 'amount', 'description', 'category'],
        where:{user_id:req.id},
})
const stringfied= JSON.stringify(expenseData);
const userID= req.id;
const filename=`Expense${userID}/${new Date()}.txt`;
const getURL= await uploadToS3(stringfied, filename);
res.status(200).json({getURL, success: true})

}
catch(err)
{
    res.status(500).json({getURL:'', Success: false, err:err});
}
})