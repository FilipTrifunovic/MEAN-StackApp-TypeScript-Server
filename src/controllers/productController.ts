import { Router, Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';

export function getProducts(req: Request, res: Response): void {
    Product.find({})
        .then((data) => {
            res.status(200).send({
                data
            })
        })
        .catch((err) => {
            res.status(404).send({
                err: Error
            })
            console.log(err);
        })
}

export function getProduct(req: Request, res: Response): void {
    var title: String = req.params.title;
    if (title) {
        Product.findOne({
            title: title
        }).then((object) => {
            if (!object) {
                return res.status(404).send();
            }
            res.status(200).json(object);
        }).catch((err) => {
            res.status(400).send(err);
        })
    }
}

export function postProduct(req: Request, res: Response,next:NextFunction) {
    const image = req.file;
    console.log(image);
    if(!image){
       return res.status(422).send({
           message:'Not good file',
       })
    }

    let product = new Product({
        createdAt: new Date().getTime(),
        title: req.body.title,
        subtitle: req.body.subtitle,
        price: req.body.price,
        imageUrl: image.path,
        text: req.body.text
    })

    product.save().then((doc) => {
        res.status(200).send(doc);
    }, (err) => {
        res.status(400).send(err);
    })
}

export function deleteProduct(req: Request, res: Response): void {
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