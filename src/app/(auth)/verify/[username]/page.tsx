'use client'
import { ApiResponse } from '@/Types/ApiResponse';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as  z  from "zod"
// Form component
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"



const VerifyAccount = ()=>{
    const router = useRouter()
    const params = useParams<{username:string}>()
    const {toast} = useToast()
// zod implimentation 
const form = useForm<z.infer <typeof verifySchema>>({
    resolver:zodResolver(verifySchema)
})

    const noSubmit = async (data:z.infer<typeof verifySchema>) =>{
        try {
            var responce = await axios.post(`/api/verify-code`,{
                username:params.username,
                code:data.code
            })
            toast({
                title:'sucess',
                description:responce.data.message
            })
            router.replace('../sign-in')
        } catch (error) {
            console.error("error is signing up of User ",error);
            const axioError = error as AxiosError <ApiResponse>
            toast({
                title:"verified",
                description:axioError.response?.data.message,
                variant:"destructive"
            })
        }
    }

    return(
    <div className='flex justify-center items-center min-h-screen bg-gray-500'>
        <div className=' w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
                <p className="mb-4 font-semibold">Enter The Verification Code Sended to you Email</p>
            </div>
                    <Form {...form}>
            <form onSubmit={form.handleSubmit(noSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                        <Input placeholder="Code" {...field} />
                    </FormControl>
                    <FormDescription>
                        Verify Your account .
                    </FormDescription>
                    </FormItem>
                )}
                />
                <Button type="submit">Submit</Button>
            </form>
            </Form>
        </div>
    </div>
    )
}
export default VerifyAccount;