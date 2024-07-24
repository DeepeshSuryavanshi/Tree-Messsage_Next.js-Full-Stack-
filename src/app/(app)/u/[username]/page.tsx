'use client'
import React from 'react';
import { useSession,signOut } from 'next-auth/react';
import {User} from 'next-auth'
import { Button } from "@/components/ui/button";
import { ApiResponse } from '@/Types/ApiResponse';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import * as  z  from "zod"
import { Textarea } from '@/components/ui/textarea';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import dbConnect from '@/lib/dbConnect';
import { messageSchema } from '@/schemas/messageSchema';


function Page(){
    const router = useRouter()
    const params = useParams<{username:string}>()
    const {toast} = useToast()

    const form = useForm<z.infer <typeof messageSchema>>({
        resolver:zodResolver(messageSchema)
    })
    // submit route
    const onSubmit = async (data:z.infer<typeof messageSchema>) =>{
        try {
            var responce = await axios.post(`/api/send-message`,{
                username:params.username,
                content:data.Content
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
    <div className='flex items-center flex-col'>
        <h2 className='flex mt-10 text-center text-4xl font-bold m-10'>Public Profile Link</h2>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/4 space-y-6">
        <FormField
          control={form.control}
          name="Content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send Anonymous Message to @{params.username}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write you anonymouse message. "
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
    )
}
export default Page;