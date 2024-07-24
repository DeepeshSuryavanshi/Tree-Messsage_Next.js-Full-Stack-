import { getServerSession } from "next-auth"
import { authOPtions } from "../../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function DELETE(request:Request,{params}:{params:{messageid:string}}) {
    await dbConnect()
    const messageID =  params.messageid
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
        var result = await UserModel.updateOne(
            {_id:user._id},
            {$pull: {messages:{_id:messageID}}}
        )
        if(result.modifiedCount == 0){
            return Response.json({
                sucess:false,
                message:'Message not Found or already Deled'
            },{status:404})
        }

        return Response.json({
            sucess:true,
            message:'Message Deleted Sucessfully.'
        },{status:200})

    } catch (error) {
        console.log(error);
        return Response.json({
            sucess:false,
            message:'server error or DB error !'
        },{status:404})
    }
}