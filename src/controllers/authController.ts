import { Request,Response,NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';

export function register (req:Request,res:Response,next:NextFunction){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error(`Validation failed`);
        error['statusCode']=422;
        //error['data']=errors;
        throw error;
    }
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;
    bcryptjs.hash(password,12).then(hasPassword=>{
        const user = new User({
            email:email,
            password:hasPassword,
            name:name
        })
        return user.save()
    }).then(result=>{
        res.status(201).json({message:`User created`})
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    });
}

export function login(req:Request,res:Response,next:NextFunction){
    const email=req.body.email;
    const password=req.body.password;
    let loadedUser;
    User.findOne({email:email})
        .then(user=>{
            if(!user){
                const error = new Error(`User with this email ${email} could not be found`);
                error['statusCode']=401;
                //error['data']=errors;
                throw error;
            }
            loadedUser=user;
            return bcryptjs.compare(password,loadedUser.password)
        }).then(isEqual=>{
            if(!isEqual){
                const error = new Error(`Whrong password`);
                error['statusCode']=401;
                //error['data']=errors;
                throw error;
            }
            const token = generateJWT(loadedUser.email,loadedUser._id)
            res.status(200).json({token:token,userId:loadedUser._id.toString()})
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        })
}

export function checkEmailNotTaken(req:Request,res:Response){
    const email = req.query.email;
    console.log(email);
    if(email){
        User.findOne({email:email}).then(user=>{
            if(user){
                 res.send({
                    emailTakend:true,
                    message:'Email addres already exists'
                })
            }else {
                res.send({
                    emailTakend:false,
                    message:'Valid Email'
                })
            }
        }).catch(err=>console.log(err))
    }
}

function generateJWT(email:string,userId:any){
    const token = jwt.sign({email:email,
        userId:userId.toString()},
        'secret',
        { expiresIn:'1h'})
        return token;
}