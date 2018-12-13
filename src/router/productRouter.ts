import { Router, Request, Response, NextFunction } from 'express';
import Product from '../models/Product';

class ProductRouter {


    router: Router;

    constructor() {
        this.router = Router();
        this.routes();

    }

    public GetProducts(req: Request, res: Response): void {
        Product.find({})
            .then((data) => {
                res.status(200).send({
                    data
                })
            })
            .catch((err) => {
                res.status(404).send({
                    err:Error,
                    status
                })
                console.log(err);
            })
    }

    public GetProduct(req: Request, res: Response): void {
        var title: String = req.params.title;
        if (title) {
            Product.findOne({
                title: title
            }).then((object) => {
                if (!object) {
                    return res.status(404).send();
                }
                res.send( JSON.stringify(object) );
            }).catch((err) => {
                res.status(400).send(err);
            })
        }
    }

    public PostProduct(req: Request, res: Response): void {
        let product = new Product({
            createdAt: new Date().getTime(),
            title: req.body.title,
            subtitle:req.body.subtitle,
            price: req.body.price,
            image: req.body.image,
            text:req.body.text
        })

        product.save().then((doc) => {
            res.status(200).send(doc);
        }, (err) => {
            res.status(400).send(err);
        })
    }

    public DeleteProduct(req: Request, res: Response): void {
        let title: String = req.params.title;
        if (title) {
            Product.findOneAndRemove({
                title: title
            }).then((doc) => {
                if (!doc) return res.status(404).send();
                res.send({ doc });
            })
        }
    }

    public UpdateProduct(req:Request,res:Response):void{
        
    }


    routes() {
        this.router.get('/', this.GetProducts);
        this.router.get('/:title', this.GetProduct);
        this.router.post('/', this.PostProduct);
        this.router.delete('/:title', this.DeleteProduct);
    }
}



//export 
const productRoutes = new ProductRouter();
productRoutes.routes();

export default productRoutes.router;