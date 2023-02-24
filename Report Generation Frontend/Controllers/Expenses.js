const express= require('express');
const expenses= require('../models/expenses');
const users=require('../models/users');
const sequelize = require('../util/database');



const app= express();

exports.GetAllData= (async (req, res)=>{

    try
    {   
        const promise= await new Promise((resolve, reject)=>{
           const expenseData= users.findAll({
            attributes:['ispremium'],
            include: [{model: expenses, attributes: ['productid', 'amount', 'description', 'category']}],
            where:{id:req.id},
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