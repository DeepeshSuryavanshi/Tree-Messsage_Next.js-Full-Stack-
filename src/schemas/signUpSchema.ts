import {z} from "zod";

export const usernameValidation = z
        .string()
        .min(2,"Username must Be 2 or more Latters")
        .max(20,"Username must be no more than  20 charectors")
        // .regex(/^[a-zA-Z0-9_]+$/ ,"Username not be contain special charectors")
export const signeUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email address"}),
    password:z.string().min(8,{message:'password must be at least 8 charectors'})
                       .max(8,{message:'password must be at least 8 charectors'})
})