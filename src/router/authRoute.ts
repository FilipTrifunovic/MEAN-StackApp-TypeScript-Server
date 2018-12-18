import { Router, Request, Response, NextFunction } from "express";
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { check,validationResult,body } from'express-validator/check';

import { User, IUserModel } from '../models/User';
import MailService from '../utils/mail';

class AuthRoutes {
    
    transporter:any 
    router:Router;

    constructor(){
        this.router=Router();
        this.routes(); 
    }

    public postLogin(req:Request,res:Response,next:NextFunction){
       const email = req.body.email;
       const password=req.body.password;
       User.findOne({email:email}).then(
           user=>{
               if(!user){
                   return res.status(504).send({
                       message:`Whrond user Name`
                   })
               }
               bcryptjs.compare(password,user.password)
               .then(result=>{
                   if(result){
                       req.session.isLoggedIn=true;
                       req.session.user=user;
                   return req.session.save(err=>{
                        console.log(err);
                        return res.send({
                            message:`password corect`
                        }) 
                    })
                   }
                    res.send({message:`Password Correct User logged in`})
               })
               .catch(err=>{
                   console.log(err);
                   res.send({
                       message:`password incorect`
                   })
               })
           }
       )
    }

    public postLogout(req:Request,res:Response){
        req.session.destroy((err)=>{
            console.log(err)
            res.send(`Log Out`);
        });
    }


    public postRegister(req: Request, res: Response) {
        const email = req.body.email;
        console.log(`Email ${email}`);
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const errors=validationResult(req);
        console.log(errors)
        if(!errors.isEmpty()){
            return res.status(422).send({
                Message:`Invalid input`,
                errorMessage:errors.array()[0]['msg']
            })
        }
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                   // return res.redirect('/signup');
                }
                return bcryptjs.hash(password, 12)
                    .then(hashedPassword => {
                        const userToSignup = new User({
                            email: email,
                            password: hashedPassword
                        });
                        return userToSignup.save()
                    })
                    .then(result => {
                        res.status(200).send({
                            result,
                            message:'UserRegistered'
                        })
                    })
            }).catch(err => {
                res.status(404).send({
                    message:`Error whilre registering`,
                    error:err
                })
                console.log(err)})
    }


    public getLogin(req: Request, res: Response){
        res.send({
            date:Date.now()+1000*60*60,
            message:'Poslat mail'
        })
        //res.send({text: 'user loged in'})
        const to=`f.trifunovic@yahoo.com`;
        const from='filip.mail@test.com';
        const subject='Test mail za logoanje';
        const message='<h1>Poslat Mail </h1>';
        MailService.sendMail(to,from,subject,message).then(result=>{
            console.log(result);
        }).catch(err=>{
            console.log(err)
        });
    }

    public postResetPassword(req: Request, res: Response){
         crypto.randomBytes(32,(err,buffer)=>{
             if(err){
                 return res.send({message:`Greska!`})
             }
             const token = buffer.toString();
             User.findOne({email:req.body.email}).then((user:IUserModel)=>{
                if(!user){
                    res.send({
                        message:'No account with that email found'
                    })
                }
                user.resetTokent=token;
                user.resetTokenExpiration= Date.now()+1000*60*60;
                return user.save()
             }).then(result=>{
                 const mailContent=`
                 <p>You requested a password reset</p>
                 <p>Click this link to set a new password <a href="http://localhost:4000/auth/reset/${token}"></p>`;
                 MailService.sendMail(req.body.email,'filip.mail@test.com','Password Reset Mail',mailContent)
             })
             .catch(err=>{
                 console.log(err)
             })
         })
    }

    routes(){
        this.router.get('/',this.getLogin)
        this.router.post('/',this.postLogin);
        this.router.post('/logout',this.postLogout);  
        this.router.post('/register',[check('email')
                                    .isEmail()
                                    .withMessage('Please Enter a Valid Email')
                                    .custom((value,{req})=>{
                                        if(value==='test@test.com')
                                        throw new Error(`This Email Address if Frobiden`)
                                    }),
                                    body('password',`Email must at least 5 characters`)
                                    .isLength({min:5}) ],this.postRegister);

    }
}

const authRoutes= new AuthRoutes();
authRoutes.routes()

export default authRoutes.router;