import { getServerSession } from "next-auth"
import { authOPtions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function GET(request:Request) {
    await dbConnect()
    try {
        // const user = await UserModel.findOne({_id:userID})
        const user = await UserModel.find()
        if(!user){
            return Response.json({
                sucess:false,
                message:"No use found Message Yet......"
            },{status:404})
        }
        return Response.json({
            sucess:true,
            data:user
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