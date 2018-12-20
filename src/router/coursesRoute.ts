import { Router, Request, Response, NextFunction } from 'express';
import {Course, ICourseModel} from "../models/Course";

import { check,validationResult,body } from'express-validator/check';

//import { Types } from 'mongoose';


class CoursesRoute {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();

    }

    public getCourses(req: Request, res: Response,next:NextFunction): void {
        var time = new Date();
        
        console.log(time.setDate(time.getDate()+1));
        Course.find({})
        .select('title description -_id')
            .then((data) => {
                res.setHeader('Set-Cookie',`test=true; Max-Age=15`);
                res.status(200).send({data})
                const error = new Error(`Error Object Message`);
                error['status']=300;
                console.log(error['status']);
            })
            .catch((err) => {
                const error = new Error(`406 eror message`);
                error['status']=406;
                return next(error);
            })
    }

    public getCourse(req: Request, res: Response,next:NextFunction): void {
        var slug: String = req.params.slug;
        console.log(`Course Title:`+slug);
        if (slug) {
            Course.findOne({
                slug: slug
            }).then((object) => {
                console.log(object);
                if (!object) {
                    return res.status(404).send();
                }
                res.send(object);
            }).catch((err) => {
                const error = new Error(`406 eror message`);
                error['status']=400;
                return next(error);
            })
        }
    }

    public postCourse(req: Request, res: Response,next:NextFunction) {
        console.log(req.body.title);
        let course = new Course({
            updated: new Date().getTime(),
            title: req.body.title,
            slug:req.body.slug,
            description: req.body.description,
            category: req.body.category,
            length:req.body.length,
            totalSteps:req.body.totalSteps,
            steps:req.body.steps,
            // Storovanje mongoose ID-a
            // _id: new Types.ObjectId(req.body.id)
        })
        const errors=validationResult(req);

        if(!errors.isEmpty()){
           return res.send({
                errorMessage:errors.array()['msg'],
                error:`Error Invalid Inputs`
            })
        }
            course.save().then((doc) => {
                res.status(201).send(doc);
            }).catch(err=>{
                const error = new Error(err);
                error['status']=400;
                return next(error);
            })
        
    }

    public deleteCourse(req: Request, res: Response) {
        let title: String = req.params.title;
        if (title) {
            Course.findOneAndRemove({
                title: title
            }).then((doc) => {
                if (!doc) return res.status(404).send();
                res.status(200).send({ doc });
            })
        }
    }

    public updateCourse(req:Request,res:Response,next:NextFunction):void{
        // Ako throwujemo gresku u sinhronom delu koda vam promisa express ce detektovati gresku i proslediti error middleware-u 
        // U asinhronom kodu moramo da koristimo next(error) kako bi dosli do error handling middleware-a
        // throw new Error()
        const courseTitle=req.body.title
        const length=req.body.length;
        // Course.findOneAndUpdate({title:courseTitle},{length:length}).then(response=>{
        //     console.log(response)
        // })
        Course.findOne({title:courseTitle}).then((course:ICourseModel)=>{
            course.length=length;
            return course.save()
        }).then(result=>{
            console.log(`Course Updated`);
            res.status(200).send(`Course Updated`)
        }).catch(err=>{
            const error = new Error(`404 eror message`);
                error['status']=404;
                return next(error);
        })
    }


    routes() {
        this.router.get('/', this.getCourses);
        this.router.get('/:slug', this.getCourse);
        this.router.post('/',[
            body('title')
                .isAlphanumeric()
                .isLength({min:5})
                .trim(),
            body('description')
                //.isURL()
                .isLength({min:5})
                .trim()],
                 this.postCourse);
        this.router.delete('/:slug', this.deleteCourse);
        this.router.put('/',this.updateCourse);
    }
}

const productRoutes = new CoursesRoute();
productRoutes.routes();

export default productRoutes.router;

// Cookie se poedasava res.setHeader('Set-Cookie',`test=true; Max-Age=15; Secure; HttpOnly`); mozemo postavidi neke opcije kao na primer koliko sekundi traje cookie sa Max-Age 
// Secure znaci da se cookie salje samo sa https requestovima
// HttpOnly znaci da cient side javascript ne moze da pristupi cookie-u ne moze client side js da procita cookie