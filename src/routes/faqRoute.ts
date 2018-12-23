import { Router} from 'express';
import { getFaq } from '../controllers/faqController';

export class FaqRoute{

    router:Router;

    constructor(){
        this.router=Router();
        this.routes();
    }

    // public getFaq(req:Request,res:Response):void{
    //     Faq.find()
    //         .then((data)=>{
    //             console.log(`Data ${data}`);
    //             if(data.length>0){
    //                 res.status(200).send({
    //                     data
    //                 })
    //             }else {
    //                 res.status(200).send(`No Questions Found! 0 data`)
    //             }
                
    //         }).catch(err=>{
    //             res.status(404).send(err);
    //         })
    // }

    routes(){
        this.router.get(`/`,getFaq);
    }
}


const faqRoutes = new FaqRoute();
faqRoutes.routes();

export default faqRoutes.router;