export interface ICourse{
    createdAt:Date,
    title:String
    slug:String,
    description:String,
    length:Number,
    totalsteps:Number,
    updated:Date,
    steps:[String],
    creator:String
}