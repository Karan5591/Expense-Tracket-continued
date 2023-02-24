const express= require('express')
const jwt= require("jsonwebtoken")
const dotenv= require("dotenv")
// const cookieParser= require('cookie-parser')
// app.use(cookieParser());



dotenv.config();

const TokenCheck= ((req, res, next)=>{
        const token= req.cookies.jwtoken;
        console.log(token)
        if(!token)
        {
            return res.status(403).send("Token required for verification")
        }
        try
        {
            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
              }
             
            const decoded= jwt.verify(token, 'secretKey')
            req.id= decoded.user_id;
           // console.log(req.id);
        }
        catch(err)
        {
            console.log(err)
        }
        return next();

});
module.exports = TokenCheck;