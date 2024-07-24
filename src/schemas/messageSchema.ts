import {z} from 'zod';
export const messageSchema = z.object({
    Content:z.string()
             .min(10,{message:"Content must be at leat 10 charecters"})
             .max(300,{message:"Content must be no long then 300 charecters"})
})