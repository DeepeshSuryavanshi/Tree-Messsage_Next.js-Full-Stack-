import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import {usernameValidation} from '@/schemas/signUpSchema'
import { STATES } from "mongoose";

const usernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request) {
    await dbConnect()
    try {
    const {searchParams} = new URL(request.url)
    const queryParms = {
        username:searchParams.get('username')
    }    
    const result = usernameQuerySchema.safeParse(queryParms)
    if(!result.success)
        {
            const usernameError:any = result.error.format().username?._errors
            return Response.json({
                sucess:false,
                message: usernameError?.length > 0 ?usernameError?.join(',') : "invalid query Parameter"
            },{status:500})       
        }

        const {username} = result.data
        const existingVerifiedUser =await UserModel.findOne({username,isVerified:true})
        
        if (existingVerifiedUser){
            return Response.json({
                sucess:false,
                message: "username is already taken"
            },{status:500}) 
        }
      
        return Response.json({
            sucess:true,
            message: "username is unique"},{status:200}) 
            
    } catch (error) {
        console.log("Error checking username",error);
        return Response.json({
            sucess:false,
            message:"error checking Username!"
        },{status:500})       
    }
}