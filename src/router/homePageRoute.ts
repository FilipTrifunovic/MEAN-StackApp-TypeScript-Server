import { Router,Request,Response } from "express";

class HomePageRouter{
    router:Router;


    constructor(){
        this.router =Router();
        this.routes();
    }


    public HomePage(req:Request,res:Response){
        return res.render('index')
    }


    routes() {
        this.router.get('/');
    }
}


//export 
const homeRoutes = new HomePageRouter();
homeRoutes.routes();

export default homeRoutes.router;