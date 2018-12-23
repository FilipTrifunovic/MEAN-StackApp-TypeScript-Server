import { Request, Response,NextFunction } from "express";
import fs from 'fs';
import path from 'path';
import { Course, ICourseModel } from "../models/Course";
import { validationResult } from "express-validator/check";

import { Types } from 'mongoose';
import { User } from "../models/User";



export function updateCourse(req:Request,res:Response,next:NextFunction){
        const title= req.body.title;
    
        Course.findOne({title:title}).then(course=>{
            if(!course){
                const error= new Error(`Course not found course`);
                error['statusCode']=404;
                throw error;
            }
            course.title=title;
            course.description=req.body.description;

            return course.save()
        }).then(result=>{
            res.status(200).json({message:`Post Updated , post:${result}`})
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode= 500;
            }
            next(err);
        })
}

export function clearImage(fileUrl:string){
    const filePath=path.join(__dirname,'../data/images',fileUrl);
    fs.unlink(filePath,err=>{console.log(err)})
}

export function getCourses(req: Request, res: Response,next:NextFunction): void {
    var time = new Date();
    
    console.log(time.setDate(time.getDate()+1));
    Course.find({}) 
    // Paginacija skip preskace prvih n itema limit limitira broj itema koji vraca
    // .skip((page-1)*ITEMS_PER_PAGE)
    // .limit(ITEMS_PER_PAGE)
    .select('title description -_id')
        .then((data) => {
            res.setHeader('Set-Cookie',`test=true; Max-Age=15`);
            res.status(200).json({data});
        })
        .catch((err) => {
            if(!err.statusCode){
                err.statusCode=400;
            }
            next(err);
        })
}

export function getCourse(req: Request, res: Response,next:NextFunction): void {
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
            if(!err.statusCode){
                err.statusCode=400;
            }
            next(err);
        })
    }
}

export function postCourse (req, res: Response,next:NextFunction) {
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
        creator:req.userId
        // Storovanje mongoose ID-a
        // _id: new Types.ObjectId(req.body.id)
    })
    const errors=validationResult(req);

    if(!errors.isEmpty()){
       const error = new Error(`Validation Failed Entered Data is Incorect`);
       error['statusCode']=422;
       throw error;
    }
        course.save().then((doc):any => {
            return User.findById(req.userId)
        }).then(user=>{
            user.courses.push(course)
            res.status(201).json({
                message:`Saved course`
            });

        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=400;
            }
            next(err);
        })
    
}

export function deleteCourse(req: Request, res: Response,next:NextFunction) {
    let title: String = req.params.title;
    if (title) {
        Course.findOneAndRemove({
            title: title
        }).then((doc) => {
            if (!doc) return res.status(404).send();
            res.status(200).send({ doc });
        }).catch(err=>{
            if(!err.statusCode){
                err.statusCode=400;
            }
            next(err);
        })
    }
}

export function updateCourse1(req:Request,res:Response,next:NextFunction):void{
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
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    })
}

export function deleteWithAuth(req:Request,res:Response,next:NextFunction){
    const courseId:string=req.params.courseId;
    Course.findById(courseId)
    .then((course:ICourseModel):any=>{
        //check if user logged in 
        if(!course){
            const error= new Error(`Course not found course`);
            error['statusCode']=404;
            throw error;
        }
         return Course.findOneAndRemove(courseId)
    }).then(result=>{
        console.log(result);
        res.status(200).json({message:'Deleted Post'});
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    })
}

export function getCoursesWithPagination(req:Request,res:Response,next:NextFunction){
    const currentPage=req.query.page || 1;
    const perPage=2;
    let totalItems;
    Course.find().countDocuments()
    .then((count):any=>{
        totalItems=count;
        return Course.find()
        .skip((currentPage-1)*perPage)
        .limit(perPage);
    }).then(courses=>{
        res.status(200).json({
            message:`Courses`,
            courses:courses,
            totalItems
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    })
}
