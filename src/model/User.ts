import mongoose,{Schema,Document} from "mongoose";
//message schema 
export interface Message extends Document{
    content:String;
    createdAt:Date
}
const MessageSchema:Schema<Message> = new Schema({
  content:{
    type:String,
    require:true
  },
  createdAt:{   
    type:Date,
    require:true,
    default:Date.now
  }
})
//User schema
export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    isVerified:boolean;
    verifyCodeExpiry:Date;
    isAcceptingMessage:boolean;
    messages:Message[]
}

const UserSchema :Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+\.+/,"Please use a valid Email Adderss"]
    },
    password:{
        type:String,
        required:[true,"Password Is Required"],
    },
    verifyCode:{
        type:String,
        requireed:[true,"Verify Code Is Required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verifyCodeExpiry is required"]
    },
    isVerified:{
        type:Boolean,
        required:[true,"is verified  are required."],
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User',UserSchema))
export default UserModel;