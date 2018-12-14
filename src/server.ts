import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

//Local imports
import homeRoutes from './router/homePageRoute'
import productRouter from './router/productRouter';
import courseRouter from './router/coursesRoute';
import faqRouter from './router/faqRoute';
//import MongoDb from './utils/database';

//Server
class Server {

    app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.server();
    }

    public config() {
        //MongoDb.mongooseConnect();
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors({ origin: 'http://localhost:4200' }));
        this.app.use(morgan('dev'));
        this.app.use((req, res, next) => {
            console.log(`Middleware`);
            next();
        })
    }

    public routes(): void {
        let router: express.Router;
        router = express.Router();

        this.app.use('/', router);
        this.app.use('/api/products', productRouter);
        this.app.use('/api/home', homeRoutes)
        this.app.use('/api/courses/', courseRouter)
        this.app.use('/api/faq', faqRouter)
        this.app.use('', (req, res) => {
            res.status(404).send({ data: 'No Items found' })
        })
    }

    public server() {
        mongoose.connect('mongodb+srv://filip:ToUt1IkGo6MOf6Ev@nodejs-yhbtj.mongodb.net/NodeJs?retryWrites=true',{useNewUrlParser:true,useCreateIndex:true})
        .then(result=>{
            console.log(`Connected to MongoDb`);
            this.app.listen(4000, (err) => {
                if (err) throw err;
                console.log('App now listening for requests on port 4000');
            })
        })
        .catch(err=>console.log(err))
    }


}

export default new Server().app;
