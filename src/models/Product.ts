import { Schema,model, Document, Model } from 'mongoose';
import { IProduct } from './Interface/IProduct';

export interface IProductModel extends IProduct,Document{}

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
    imageUrl:{
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

export const Product:Model<IProductModel>=model<IProductModel>('Product',ProductSchema)
//export default model('Product',ProductSchema)

