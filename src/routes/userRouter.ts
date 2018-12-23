import { Router } from "express";


class UserRouter{

    router:Router;

    
    constructor() {
        this.router=Router();
        this.routes();

    }

    routes(){
        this.router.get('')
    }

}


const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;