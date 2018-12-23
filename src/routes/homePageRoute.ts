import { Router,Request,Response } from "express";

class HomePageRouter{
    router:Router;


    constructor(){
        this.router =Router();
        this.routes();
    }


    public homePage(req:Request,res:Response){
       res.send(200).json({message:`Home Page Data`})
    }


    routes() {
        this.router.get('/');
    }
}


//export 
const homeRoutes = new HomePageRouter();
homeRoutes.routes();

export default homeRoutes.router;