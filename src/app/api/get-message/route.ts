import { getServerSession } from "next-auth"
import { authOPtions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function GET(request:Request) {
    await dbConnect()
    // sesion to featch 
    const session = await getServerSession(authOPtions)
    const user:User = session?.user as User
    if(!session || !session.user){
        return Response.json({
            sucess:false,
            message:"Not Authenticated"
        },{status:401})
    }
    // User id featching
    const userID = new mongoose.Types.ObjectId(user._id)
    
    try {
        // const user = await UserModel.findOne({_id:userID})
        const user = await UserModel.aggregate([
            { $match: { _id: userID } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
          ]).exec();
        
        if(!user || user.length == 0){
            return Response.json({
                sucess:false,
                message:"Message You have no Message Yet......"
            },{status:404})
        }

        return Response.json({
            sucess:true,
            messages:user[0].messages
        },{status:200})
    } catch (error) {
        console.log("An unexpected error",error);
        return Response.json({
            sucess:false,
            message:"Internal server error",
            error
        },{status:500})
    }
}