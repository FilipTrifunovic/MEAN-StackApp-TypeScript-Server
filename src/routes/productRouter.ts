import { Router } from 'express';

import { getProduct,getProducts,deleteProduct,postProduct } from '../controllers/productController';

class ProductRouter {


    router: Router;

    constructor() {
        this.router = Router();
        this.routes();

    }

    routes() {
        this.router.get('/', getProducts);
        this.router.get('/:title', getProduct);
        this.router.post('/', postProduct);
        this.router.delete('/:title', deleteProduct);
    }
}



//export 
const productRoutes = new ProductRouter();
productRoutes.routes();

export default productRoutes.router;