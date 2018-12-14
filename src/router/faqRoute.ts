import { Router, Request, Response, NextFunction } from 'express';
import { Faq } from "../models/Faq";

export class FaqRoute{

    router:Router;

    constructor(){
        this.router=Router();
        this.routes();
    }

    public GetFaq(req:Request,res:Response):void{
        Faq.find()
            .then((data)=>{
                console.log(`Data ${data}`);
                if(data.length>0){
                    res.status(200).send({
                        data
                    })
                }else {
                    res.status(404).send(`No Questions Found!`)
                }
                
            }).catch(err=>{
                res.status(404).send(err);
            })
    }

    routes(){
        this.router.get(`/`,this.GetFaq)
    }
}


const faqRoutes = new FaqRoute();
faqRoutes.routes();

export default faqRoutes.router;