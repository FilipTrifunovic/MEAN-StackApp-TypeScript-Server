import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import PDFDocument from 'pdfkit';

import fs from 'fs';
import { deleteFile } from '../utils/deleteFile';
import readLine from 'readline';
import { observable,Observable,bindCallback } from 'rxjs';
import { map, onErrorResumeNext } from 'rxjs/operators';


export class FileRoute{

    router:Router;

    constructor(){
        this.router=Router();
        this.routes();
    }

    public rxjsTest(x,callback){
        const y = x+10;
        callback(y);
    }
    
    public processLinesCb(lines){
        console.log(`lines`+lines);
    }

    public getFile(req:Request,res:Response,next:NextFunction):void{
     const fileName=req.params.fileName
     console.log(`FILE`);
     console.log(fileName);
     const filePath=path.join('data','files',fileName);
    //  console.log(filePath);
    // Preloadovanje Fileova moze se koristiti za manje fileove Bolje Streamovati Fileove
    //  fs.readFile(filePath,(err,file)=>{
    //     if(err){
    //         const error=new Error(`Ne postoji File`);
    //         error['status']=404;
    //         return next(error);
    //     }
    //     res.setHeader('Content-Type','application/pdf');
    //     res.setHeader('Concent-Disposition',`inline; filename=${fileName}`);
    //     res.status(200).send(file);
    //  })

        const file=fs.createReadStream(filePath);
        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Concent-Disposition',`inline; filename=${fileName}`);
        file.pipe(res);

    }

    public postUploadFile(req:Request,res:Response){
        const file =req.file;
        console.log(file);
        if(!file){
            return res.status(422).send({
                message:'Invalid input file' 
            })
        }
        const fileUrl= file.path; 
        res.send({message:`File Uplad`});
    }

    public getPdfDocument(req:Request,res:Response){
        const pdfDoc=new PDFDocument();
        const filename= new Date().getTime() + "-"+"file.pdf";
        const filePath=path.join('data','files',filename);
        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition',`inline; filename=${filename}`);
        const pdf=pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text(`Test PDF`,{
            underline:true
        });
        pdfDoc.end();
    }

    public deleteFile(req:Request,res:Response){
        const filePath=path.join('data','files','1545406384375-FinViz.txt');
        deleteFile(filePath).then(message=>{
            res.status(200).send({
                message:`File ${filePath} deleted`
            })
        }).catch(err=>{
            res.status(502).send({err})
        })
        
    }

    routes(){
        this.router.get('/getPdf',this.getPdfDocument);
        this.router.post('/uploadFile',this.postUploadFile);
        this.router.get(`/getFile/:fileName`,this.getFile);
        this.router.delete('/deleteFile',this.deleteFile);
        
    }

}

const fileRoutes = new FileRoute();
fileRoutes.routes();

export default fileRoutes.router;

// izvlacimo query parametre iz url-a
// req.query.email  link?email=***