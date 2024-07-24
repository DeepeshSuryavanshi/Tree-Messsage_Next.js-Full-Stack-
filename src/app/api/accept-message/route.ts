import { getServerSession } from "next-auth"
import { authOPtions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"

// post 
export async function POST(request:Request){
    await dbConnect()
    const session = await getServerSession(authOPtions)
    session?.user
    const user:User = session?.user as User
    if(!session || !session.user){
        return Response.json({
            sucess:false,
            message:"Not Authenticated"
        },{status:401})
    }
    const userID = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userID,
            {isAcceptingMessage:acceptMessages},
            {new : true}
        )
        if(!updatedUser){
            return Response.json({
                sucess:false,
                message:"User not Found"
            },{status:401})    
        }

        return Response.json({
            sucess:true,
            message:"Message status updated sucessfully..",updatedUser
        },{status:200})

    } catch (error) {
        console.log("faile to accept user message status");
        return Response.json({
            sucess:false,
            message:"faile to accept user message status"
        },{status:500})
    }
}

// Get
export async function GET(request:Request) {
    await dbConnect()
    const session = await getServerSession(authOPtions)
    const user:User = session?.user as User
    if(!session || !session.user){
        return Response.json({
            sucess:false,
            message:"Not Authenticated"
        },{status:401}) }

    const userID = user._id
    try {
        const foundUser = await UserModel.findByIdAndUpdate(userID)
        if(!foundUser){
            return Response.json({
                success:false,
                message:"Fail to founnd user, User Not found!"
            },{status:401})
        }
        return Response.json({
            success:true,
            message:"User Founded.",
            isAcceptingMessage:foundUser.isAcceptingMessage
        },{status:200})
    
    } catch (error) {
        console.log("faile to accept user message status",error);
        return Response.json({
            sucess:false,
            message:"faile to accept user message status"
        },{status:500})
    }
}


