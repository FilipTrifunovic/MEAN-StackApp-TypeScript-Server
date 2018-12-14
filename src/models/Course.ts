import { Schema,model, Document,Model  } from 'mongoose';
import { ICourse} from './Interface/ICourse';

export interface ICourseModel extends ICourse,Document{
    // cart:{
    //     productId:Schema.Types.ObjectId,
    //     quantity:string
    // }
}

let CourseSchema:Schema = new Schema({
    createdAt:Date,
    title:{
        type:String,
        default:'',
        required:true,
        unique:true
    },
    slug:{
        type:String,
        default:'',
        required:true
    },
    description:{
        type:String,
        default:'',
        required:true
    },
    length:{
        type:Number,
        default:0,
        required:true
    },
    totalsteps:{
        type:Number,
        default:0,
        required:true
    },
    updated:{
        type:Date,
        required:true
    },
    steps:{
        
        type:[String],
        required:true,
    },
    //embeded item
    // cart:{
    //     productId : {type:Schema.Types.ObjectId,
    //                  required:true
    //                  ref:'Product '
    //                  },
    //     quantity:    { type:Number,required:true}
    // }

})

export const Course:Model<ICourseModel> = model<ICourseModel>('Course',CourseSchema)
 //export default model('Course',CourseSchema)
