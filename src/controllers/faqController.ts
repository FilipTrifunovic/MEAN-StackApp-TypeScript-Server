import {  Request, Response, NextFunction } from 'express';
import { Faq } from "../models/Faq";

export function getFaq(req:Request,res:Response):void{
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

export function postFaq(req:Request,res:Response){
    const faq = new Faq({
        question:req.body.question,
        answer:req.body.answer
    })
    
    faq.save()
    .then(result=>{
        if(result) {
            res.status(200).json({result})
    }else {
        res.status(404).json({message:`Question not Saved`})
    }
    })
    .catch(err=>{res.status(404).json({message:`BD connection lost`})})
}

