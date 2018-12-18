export interface IUser {
    createdAt:Date,
    name:String,
    email:String,
    password:string,
    resetTokent:string,
    resetTokenExpiration:Number
}