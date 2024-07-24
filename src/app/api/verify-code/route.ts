import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';

export async function POST(request:Request){
    await dbConnect()
    try {
        const {username,code} = await request.json()
        const DecodedUsername = decodeURIComponent(username)
        const User = await UserModel.findOne({username:DecodedUsername})
        if(!User){
        return Response.json({
               sucess:false,
                message:"User Not Found!"
                },{status:500})  
        }

        const isCodeValid = User.verifyCode == code
        const isCodeNotExpired = new Date(User.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            User.isVerified = true;
            // update-user
            var result = await User.save()
           
            return Response.json({
                sucess:true,
                 message:"Account Verified Sucessfuly",
                 data:result
                 },{status:200}) 
        }
        else if(!isCodeNotExpired){
            return Response.json({
            sucess:false,
            message:"Verification code is Expired Please Sign-Up Again !"
            },{status:500})  
        }
        else{
            return Response.json({
                sucess:false,
                 message:"Incorrect verification Code , Try Again!"
                 },{status:500})  
        }
        
    } catch (error) {
        console.log("Error Verifiying username !",error);
        return Response.json({
            sucess:false,
            message:"error verifying Username!"
        },{status:500})  
    }
}