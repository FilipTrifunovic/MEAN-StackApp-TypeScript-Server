import fs from 'fs';

export function deleteFile(filePath:string){
   return new Promise((resolve,reject)=>{
        fs.unlink(filePath,(error)=>{
            if (error){
                console.log(error);
                reject(error);
            }else{
                resolve('File Deleted'+filePath)
                console.log(`file deleted`);
            }
        })
    
    })
    console.log(`DELETE FILE`)
    }