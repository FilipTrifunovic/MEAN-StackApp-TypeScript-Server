
import  mongoose from 'mongoose';
import validator from 'validator';

let UserSchema:mongoose.Schema = new mongoose.Schema({
    createdAt:Date,
    updatedAt:Date,
    name:{
        type:String,
        default:'',
        required:true,
        unique:true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minLength:1,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} email is not a valid email'
        }
        },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        acces:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
})

UserSchema.methods

export default mongoose.model('User',UserSchema)