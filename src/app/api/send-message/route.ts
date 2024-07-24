import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { date } from "zod";

export async function POST(request:Request) {
    await dbConnect()
    const {username,content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                sucess:false,
                message:"User not Found"
            },{status:404})
        }
        // is user accepting 
        if(!user.isAcceptingMessage){
            return Response.json({
                sucess:false,
                message:"User is not accepting Messages"
            },{status:500})
        }
        const newMessage = {content,createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            sucess:true,
            message:"Message send Sucessfully"
        },{status:200})

    } catch (error) {
        return Response.json({
            sucess:false,
            message:"Internal server error",
            error
        },{status:500})}
}
