import { Router, Request, Response, NextFunction } from 'express';
import Course from "../models/Course";

class CoursesRoute {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();

    }

    public GetCourses(req: Request, res: Response): void {
        Course.find({})
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

    public GetCourse(req: Request, res: Response): void {
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

    public PostCourse(req: Request, res: Response): void {
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

    public DeleteCourse(req: Request, res: Response): void {
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

    public UpdateCourse(req:Request,res:Response):void{
        
    }


    routes() {
        this.router.get('/', this.GetCourses);
        this.router.get('/:slug', this.GetCourse);
        this.router.post('/', this.PostCourse);
        this.router.delete('/:slug', this.DeleteCourse);
    }
}

const productRoutes = new CoursesRoute();
productRoutes.routes();

export default productRoutes.router;