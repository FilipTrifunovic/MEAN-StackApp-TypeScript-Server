import { Schema,model } from 'mongoose';



let ProductSchema:Schema = new Schema({
    createdAt:Date,
    title:{
        type:String,
        default:'',
        required:true,
        unique:true
    },
    subtitle:{
        type:String,
        default:'',
        required:true,
    },
    price:{
        type:Number,
        default:'',
        required:true
    },
    image:{
        type:String,
        default:'',
        required:true
    },
    text:{
        type:String,
        default:'',
        required:false
    }
})

export default model('Product',ProductSchema)

