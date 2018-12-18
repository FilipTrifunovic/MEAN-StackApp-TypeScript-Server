import { Router, Request, Response, NextFunction } from 'express';
import {Course, ICourseModel} from "../models/Course";



class CoursesRoute {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();

    }

    public getCourses(req: Request, res: Response): void {
        var time = new Date();
        console.log(time.setDate(time.getDate()+1));
        Course.find({})
        .select('title description -_id')
            .then((data) => {
                res.setHeader('Set-Cookie',`test=true; Max-Age=15`);
                res.status(200).send({data})
            })
            .catch((err) => {
                res.status(404).send({
                    err:Error
                })
                console.log(err);
            })
    }

    public getCourse(req: Request, res: Response): void {
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
                res.status(400).send(err);
            })
        }
    }

    public postCourse(req: Request, res: Response): void {
        console.log(req.body.title);
        let course = new Course({
            updated: new Date().getTime(),
            title: req.body.title,
            slug:req.body.slug,
            description: req.body.description,
            category: req.body.category,
            length:req.body.length,
            totalSteps:req.body.totalSteps,
            steps:req.body.steps
        })

        course.save().then((doc) => {
            res.status(200).send(doc);
        }, (err) => {
            res.status(400).send(err);
        })
    }

    public deleteCourse(req: Request, res: Response): void {
        let title: String = req.params.title;
        if (title) {
            Course.findOneAndRemove({
                title: title
            }).then((doc) => {
                if (!doc) return res.status(404).send();
                res.send({ doc });
            })
        }
    }

    public updateCourse(req:Request,res:Response):void{
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
        }).catch(err=>{console.log(err)})
    }


    routes() {
        this.router.get('/', this.getCourses);
        this.router.get('/:slug', this.getCourse);
        this.router.post('/', this.postCourse);
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