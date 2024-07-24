import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/Types/APIresponse";
import { promises } from "dns";

export async function sendVerifactionEmail(
    email:string,
    username:string,
    verificationcode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'TrueMessage@Dev.com',
            to: 'user@gmail.com',
            subject: 'TreueMessage code | Verification Code' ,
            react: VerificationEmail({username,otp:verificationcode}),
          });
        return {sucess:true,message:"Sucesful to send Verification_mail"}
    } catch (emailError) {
        console.error("Error sendong verificaion email",emailError)
        return {sucess:false,message:"Failed to send Verification_mail"}
    }

}