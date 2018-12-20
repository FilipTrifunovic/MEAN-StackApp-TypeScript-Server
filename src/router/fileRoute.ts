import { Router, Request, Response, NextFunction } from 'express';

import fs, { readlink } from 'fs';
import readLine from 'readline';
import { observable,Observable,bindCallback } from 'rxjs';
import { map } from 'rxjs/operators';
import multer from 'multer';


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

    public getFile(req:Request,res:Response):void{
      function readLines(){
        res.send({message:`FileRouter`});
        const lines = new Array<string>();
        const rl = readLine.createInterface({input:fs.createReadStream('src/router/file.txt'),crlfDelay:Infinity});
        rl.on('line',(line:string)=>{ lines.push(line); });
        rl.on('close',()=>{this.processLinesCb(lines); })
      }
      
      const readObservable = bindCallback(readLines);

    }

    public postUploadFile(req:Request,res:Response){
        const file =req.file;
        if(!file){
            return res.status(422).send({
                message:'Invalid input file' 
            })
        }
        const fileUrl= file.path; 
        res.send({message:`File Uplad`});
        console.log(file);
    }

    routes(){
        this.router.get(`/`,this.getFile);
        this.router.post('/uploadFile',this.postUploadFile);
        
    }

}

const fileRoutes = new FileRoute();
fileRoutes.routes();

export default fileRoutes.router;