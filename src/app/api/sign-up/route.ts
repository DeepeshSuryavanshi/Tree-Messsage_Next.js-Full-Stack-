import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { sendVerifactionEmail } from "@/helpers/sendVerificationEmail";
// ok tested
export async function POST(request:Request){
    await dbConnect()
    try {
        const {username,email,password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({username,isVerified:true})
        
        if (existingUserVerifiedByUsername){
            return Response.json({sucess:false,message:"Username already exist!"},{status:400})
        }
       
        const userExistiongByemail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (userExistiongByemail)
            {
                if(userExistiongByemail.isVerified){
                    return Response.json({
                        sucess:false,
                        message:"User already exist with this email"
                    },{status:500})
                }else{
                 const hashPassword = await bcrypt.hash(password,10)
                 userExistiongByemail.password = hashPassword;
                 userExistiongByemail.verifyCode = verifyCode;
                 userExistiongByemail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                 await userExistiongByemail.save()
                }
                
            }
       
            const hashPassword = await bcrypt.hash(password,10)
            const ExpiryDate = new Date()
            ExpiryDate.setHours(ExpiryDate.getHours() + 1)

            const newUser = await UserModel.create({
                username,
                email,
                password:hashPassword,
                verifyCode,
                isVerified:false,
                verifyCodeExpiry:ExpiryDate,
                isAcceptingMessage:true,
                message:[]
            })
        //Send verificatio Email
        const emailResponse = await sendVerifactionEmail(
            email,
            username,
            verifyCode
        )
        if (!emailResponse.sucess){
            return Response.json({
                sucess:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
            sucess:true,
            message:"User register Sucessfuly "
        },{status:200})

    } catch (error) {
        console.log("Error reqistratring from",error);
        return Response.json({
            sucess:false,
            message:"Error User register",
            result:error
        },{status:500})
        
    }
}