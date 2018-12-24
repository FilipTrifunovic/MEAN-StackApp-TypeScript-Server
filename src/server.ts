import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import multer, { Field } from 'multer';

//Importi za rad sa sesijon
import session from 'express-session';
import connectMongo  from 'connect-mongodb-session';
let MongoDBStore = connectMongo(session)
import csrf from 'csurf';

//Local imports
import homeRoutes from './routes/homePageRoute'
import productRouter from './routes/productRouter';
import courseRouter from './routes/coursesRoute';
import faqRouter from './routes/faqRoute';
import authRouter from './routes/authRoute';
import fileRouter from './routes/fileRoute';
//import MongoDb from './utils/database';

//Server
class Server {

    MONGODB_URI=`mongodb+srv://filip:ToUt1IkGo6MOf6Ev@nodejs-yhbtj.mongodb.net/NodeJs?retryWrites=true`;
    app: express.Application;
    store=new MongoDBStore({
        uri:this.MONGODB_URI,
        collection:'sessions',
       // expires:60
    });
    fileStorage= multer.diskStorage({
        destination:(req,file,callBack)=>{
            callBack(null, 'src/files')
        },
        filename:(req,file,callback)=>{
            console.log(file.filename);
           callback(null,new Date().getTime() +'-'+ file.originalname) 
        }
    });

    fileFilter=(req,file,callback)=>{
        if(file.mimetype==='image/png' || file.mimetype==='text/plain'){
            callback(null,true);
        } else{
            callback(null,false);
        }
    }
    
    csrfProtection = csrf();

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.server();
    }

    public config() {
        //MongoDb.mongooseConnect();
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(multer({storage:this.fileStorage,fileFilter:this.fileFilter}).single('file'));
        this.app.use(bodyParser.json());
       // this.app.use(cors({ origin: 'http://localhost:4200' }));
        this.app.use('/images',express.static(path.join(__dirname,'images')))
        this.app.use(morgan('dev'));
        
        this.app.use((req,res,next)=>{ 
            res.setHeader('Access-Control-Allow-Origin','*');
            res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers','Content-type, Authorization');
            next();
         })
        //Session middleware
        // opcije dodatne za session  cookie:{maxAge,expires}
        // this.app.use(session({secret:'my secret',resave:false, saveUninitialized:false,store:this.store}));
        // this.app.use(this.csrfProtection);
        // this.app.use((req,res,next)=>{
        //     res.locals.isAuthenticated=req.session.isLoggedIn;
        //     res.locals.csrfToekn=req.csrfToken();
        //     next();
        // })
    }

    public routes(): void {
        let router: express.Router;
        router = express.Router();

        this.app.use('/', router);
        this.app.use('/api/auth',authRouter);
        this.app.use('/api/products', productRouter);
        this.app.use('/api/home', homeRoutes);
        this.app.use('/api/courses/', courseRouter);
        this.app.use('/api/faq', faqRouter);
        this.app.use('/api/file',fileRouter);
        this.app.use( (req, res) => {
            res.status(404).send({ data: 'No Items found' })
        })

        this.app.use((error:any,req:Request,res:Response,next:NextFunction)=>{
           const status = error.statusCode || 500;
           const message = error.message;
           res.status(status).json({message:message});
        })

    }

    public server() {
        mongoose.connect(this.MONGODB_URI,{useNewUrlParser:true,useCreateIndex:true})
        .then(()=>{
            console.log(`Connected to MongoDb`);
            const server = this.app.listen(4000, (err) => {
                if (err) throw err;
                console.log('App now listening for requests on port 4000');
            })
            const io = require('socket.io')(server);
            io.on('connection',socket=>{
                console.log(`Client Connected`);
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }

}

export default new Server().app;
