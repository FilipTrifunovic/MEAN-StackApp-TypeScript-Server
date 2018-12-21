import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import PDFDocument from 'pdfkit';

import fs from 'fs';
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
     const filePath=path.join('src','data','files',fileName);
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
        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Concent-Disposition',`inline; filename=${req.body.fileName}`);
        const filePath=path.join('src','data','files',req.body.fileName);
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.pipe(res);

        pdfDoc.text('Hello World');
        pdfDoc.end();
    }

    routes(){
        this.router.get(`/:fileName`,this.getFile);
        this.router.post('/uploadFile',this.postUploadFile);
        
    }

}

const fileRoutes = new FileRoute();
fileRoutes.routes();

export default fileRoutes.router;