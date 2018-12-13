import mongoose from 'mongoose';

class MongoDb{

    private MONGO_URL='mongodb://filip:password1@ds159782.mlab.com:59782/nodedb';
    private MONGOATLAS_URL=`mongodb+srv://filip:ToUt1IkGo6MOf6Ev@nodejs-yhbtj.mongodb.net/test?retryWrites=true`;
    public mongooseConnect (){
        
    mongoose.connect(this.MONGO_URL || process.env.MONGO_URL).then(
           data=>{
               console.log(`Connecter To MongoDB`);
           }).catch(err=>console.log(err));
        
    }
    
}

export default new MongoDb;