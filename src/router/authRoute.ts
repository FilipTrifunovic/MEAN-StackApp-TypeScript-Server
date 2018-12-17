import { Router, Request, Response, NextFunction } from "express";
import bcryptjs from 'bcryptjs';
import { User } from '../models/User';

class AuthRoutes {

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
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    return res.redirect('/signup');
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
                        res.send({
                            text: 'user loged in'
                        })
                    })
            })
            .catch(err => console.log(err))
    }

    routes(){
        this.router.post('/',this.postLogin);
        this.router.post('/logout',this.postLogout);  
        this.router.post('/register',this.postRegister);

    }
}