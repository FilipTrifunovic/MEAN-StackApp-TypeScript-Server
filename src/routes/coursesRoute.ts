import { Router } from 'express';
import { body } from'express-validator/check';
import {  updateCourse, postCourse, getCourseAsync, getCoursesAsync, deleteWithAuthAsync } from '../controllers/courseController';

import { isAuthenticated } from '../middleware/authenticate';
//import { Types } from 'mongoose';


class CoursesRoute {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();

    }

    routes() {
        this.router.get('/', getCoursesAsync);
        this.router.get('/:slug', getCourseAsync);
        this.router.post('/',[
            body('title')
                //.isAlphanumeric()
                //.isLength({min:5})
                .trim(),
            body('description')
                //.isURL()
                .isLength({min:5})
                .trim()],
                 postCourse);
        this.router.delete('/:slug', deleteWithAuthAsync);
        this.router.put('/',updateCourse);
    }
}

const productRoutes = new CoursesRoute();
productRoutes.routes();

export default productRoutes.router;

// Cookie se poedasava res.setHeader('Set-Cookie',`test=true; Max-Age=15; Secure; HttpOnly`); mozemo postavidi neke opcije kao na primer koliko sekundi traje cookie sa Max-Age 
// Secure znaci da se cookie salje samo sa https requestovima
// HttpOnly znaci da cient side javascript ne moze da pristupi cookie-u ne moze client side js da procita cookie