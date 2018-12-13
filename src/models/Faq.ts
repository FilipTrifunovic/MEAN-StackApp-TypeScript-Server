import { Schema,model } from 'mongoose';



let FaqSchema:Schema = new Schema({
    createdAt:Date,
    question:{
        type:String,
        default:'',
        required:true,
    },
    answer:{
        type:String,
        default:'',
        required:true
    }
})

export default model('Faq',FaqSchema)
