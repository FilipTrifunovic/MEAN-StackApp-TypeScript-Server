export interface IUser {
    createdAt:Date,
    name:string,
    email:string,
    password?:string,
    resetTokent:string,
    resetTokenExpiration:Number
}