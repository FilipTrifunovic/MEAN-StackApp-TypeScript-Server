import { Schema,model, Document, Model } from 'mongoose';
import { IFaq } from './Interface/IFaq';

export interface IFaqModel extends IFaq,Document{}

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

export const Faq:Model<IFaqModel> = model<IFaqModel>('Faq',FaqSchema)
//export default model('Faq',FaqSchema)
